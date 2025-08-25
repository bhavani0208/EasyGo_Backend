import mongoose from "mongoose";
import Branch from "../models/Branch.js";

const branchRepo = {
  create: (branch) => Branch.create(branch),

  findById: (id) => Branch.findById(id),
  findAll: () => Branch.find(),
  findByCompany: (companyId) =>
    Branch.find({ company: new mongoose.Types.ObjectId(companyId) }).populate(
      "company",
      "name"
    ),

  update: (id, update) => Branch.findByIdAndUpdate(id, update, { new: true }),

  remove: (id) => Branch.findByIdAndDelete(id),
};
export default branchRepo;
