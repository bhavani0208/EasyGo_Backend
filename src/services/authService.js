import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepo } from "../repositories/userRepo.js";
import { env } from "../config/env.js";

export const authService = {
  async register({ name, email, password, role, company, branch }) {
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new Error("Email already in use");
    const hashed = await bcrypt.hash(password, 10);
    return userRepo.create({ name, email, password: hashed, role, company, branch });
  },

  async login({ email, password }) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid password");

    const token = jwt.sign(
      { id: user._id, role: user.role, companyId: user.company || null, branchId: user.branch || null },
      env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return { token, user };
  }
};
