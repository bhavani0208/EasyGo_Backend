// import { authService } from "../services/authService.js";

// export const register = async (req, res, next) => {
//   try {
//     const user = await authService.register(req.body);
//     res.status(201).json(user);
//   } catch (err) {
//     next(err);
//   }
// };

// export const login = async (req, res, next) => {
//   try {
//     const result = await authService.login(req.body);
//     res.json(result);
//   } catch (err) {
//     next(err);
//   }
// };

// export const selfRegisterAdmin = async (req, res, next) => {
//   try {
//     // expected: { name, email, password, companyId }
//     const { name, email, password, companyId } = req.body;
//     const result = await authService.selfRegisterAdmin({
//       name,
//       email,
//       password,
//       companyId,
//     });
//     res.status(201).json(result);
//   } catch (err) {
//     next(err);
//   }
// };

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Company from "../models/Company.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role,companyId: user.company },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, companyId } = req.body;

    // check if company exists
    const company = await Company.findById(companyId);
    if (!company) return res.status(400).json({ message: "Invalid company" });

    // check if email exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
      companyId: company._id,
    });

    res.status(201).json({ message: "Admin registered successfully", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
