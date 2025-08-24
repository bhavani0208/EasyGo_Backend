import User from "../models/User.js";

export const userRepo = {
  create: (data) => User.create(data),
  findByEmail: (email) => User.findOne({ email }),
  findById: (id) => User.findById(id),
  findAdminsByCompany: (companyId) =>
    User.find({ companyId, role: "ADMIN" }),
};
