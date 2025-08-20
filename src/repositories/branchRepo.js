import Branch from "../models/Branch.js";

export const branchRepo = {
  create: (data) => Branch.create(data),
  findById: (id) => Branch.findById(id),
  findByCompany: (companyId) => Branch.find({ company: companyId }),
  update: (id, data) => Branch.findByIdAndUpdate(id, data, { new: true }),
  remove: (id) => Branch.findByIdAndDelete(id),
};
