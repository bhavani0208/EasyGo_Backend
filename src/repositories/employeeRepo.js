import Employee from "../models/Employee.js";

export const employeeRepo = {
  create: (data) => Employee.create(data),
  findById: (id) => Employee.findById(id).populate("user").populate("branch"),
  findByBranch: (branchId) =>
    Employee.find({ branch: branchId }).populate("user").populate("branch"),
  update: (id, data) => Employee.findByIdAndUpdate(id, data, { new: true }),
  remove: (id) => Employee.findByIdAndDelete(id),
  findByUserId: (userId) => Employee.findOne({ user: userId }).populate("branch"),
};
