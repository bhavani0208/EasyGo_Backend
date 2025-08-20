import { branchRepo } from "../repositories/branchRepo.js";

export const branchService = {
  create: (data) => branchRepo.create(data),
  listByCompany: (companyId) => branchRepo.findByCompany(companyId),
  get: (id) => branchRepo.findById(id),
  update: (id, data) => branchRepo.update(id, data),
  remove: (id) => branchRepo.remove(id),
};
