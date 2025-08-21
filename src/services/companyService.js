import { companyRepo } from "../repositories/companyRepo.js";

export const companyService = {
  create: (data) => companyRepo.create(data),
  list: () => companyRepo.findAll(),
  listPublic: () => companyRepo.findPublic(),
  get: (id) => companyRepo.findById(id),
  update: (id, data) => companyRepo.update(id, data),
  remove: (id) => companyRepo.remove(id),
};
