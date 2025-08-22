import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepo } from "../repositories/userRepo.js";
import { companyRepo } from "../repositories/companyRepo.js"; // <-- add this to check company existence
import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";
import Company from "../models/Company.js";

export const authService = {
  async register({ name, email, password, role, company, branch }) {
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new Error("Email already in use");

    const hashed = await bcrypt.hash(password, 10);
    return userRepo.create({
      name,
      email,
      password: hashed,
      role,
      company,
      branch,
    });
  },

  async login({ email, password }) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid password");

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        companyId: user.company || null,
        branchId: user.branch || null,
      },
      env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token, user };
  },

  // --- new method: self registration for ADMIN ---
  async selfRegisterAdmin({ name, email, password, companyId }) {
    if (!name || !email || !password || !companyId) {
      throw new Error("name, email, password, and companyId are required");
    }

    const company = await companyRepo.findById(companyId);
    if (!company) {
      const err = new Error("Company not found");
      err.status = 404;
      throw err;
    }

    const existing = await userRepo.findByEmail(email);
    if (existing) {
      const err = new Error("Email already registered");
      err.status = 409;
      throw err;
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await userRepo.create({
      name,
      email,
      password: hashed,
      role: "ADMIN",
      company: company._id,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        companyId: user.company,
      },
      env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      message: "Admin registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
    };
  },
};
