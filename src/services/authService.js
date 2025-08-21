import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepo } from "../repositories/userRepo.js";
import { companyRepo } from "../repositories/companyRepo.js";
import { env } from "../config/env.js";

export const authService = {
  async register(
    { name, email, password, role, company, branch },
    { viaInvite = false } = {}
  ) {
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new Error("Email already in use");

    // Enforce registration rules
    if (!viaInvite) {
      if (role === "EMPLOYEE") {
        throw new Error(
          "Employees cannot register directly. Use invitation link."
        );
      }
      if (role === "SUPERADMIN") {
        throw new Error("SuperAdmin can only be seeded by the system.");
      }
      if (role === "ADMIN") {
        if (!company)
          throw new Error("Company is required for ADMIN registration");
        const companyExists = await companyRepo.findById(company);
        if (!companyExists) throw new Error("Company not found");
      }
    } else {
      // via invitation
      if (role === "ADMIN" || role === "EMPLOYEE") {
        if (!company) throw new Error("Company is required by invitation");
      }
    }

    // Let Mongoose pre-save hook hash the password
    return userRepo.create({
      name,
      email,
      password,
      role,
      company,
      branch,
    });
  },

  async registerDirect(data) {
    return this.register(data, { viaInvite: false });
  },

  async registerFromInvite(data) {
    return this.register(data, { viaInvite: true });
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
};
