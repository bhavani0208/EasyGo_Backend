import { employeeRepo } from "../repositories/employeeRepo.js";

export const employeeService = {
  create: (data) => employeeRepo.create(data),
  listByBranch: (branchId) => employeeRepo.findByBranch(branchId),
  listByCompany: (companyId) => employeeRepo.findByCompany(companyId),
  get: (id) => employeeRepo.findById(id),
  update: (id, data) => employeeRepo.update(id, data),
  remove: (id) => employeeRepo.remove(id),
  getByUser: (userId) => employeeRepo.findByUserId(userId),
};
