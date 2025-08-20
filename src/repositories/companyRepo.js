import Company from "../models/Company.js";

export const companyRepo = {
  create: (data) => Company.create(data),
  findAll: () => Company.find(),
  findById: (id) => Company.findById(id),
  update: (id, data) => Company.findByIdAndUpdate(id, data, { new: true }),
  remove: (id) => Company.findByIdAndDelete(id),
};
