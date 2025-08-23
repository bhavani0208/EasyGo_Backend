import mongoose from "mongoose";
import Branch from "../models/Branch.js";

 const branchRepo = {
  create: (branch) => Branch.create(branch),

  findById: (id) => Branch.findById(id),

  findByCompany: (companyId) =>
    Branch.find({ company: new mongoose.Types.ObjectId(companyId) }),

  update: (id, update) =>
    Branch.findByIdAndUpdate(id, update, { new: true }),

  remove: (id) => Branch.findByIdAndDelete(id),
};
export default branchRepo;
