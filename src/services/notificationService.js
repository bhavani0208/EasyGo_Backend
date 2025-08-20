import { notificationRepo } from "../repositories/notificationRepo.js";

export const notificationService = {
  create: (user, message, type = "INFO") => notificationRepo.create({ user, message, type }),
  listForUser: (userId) => notificationRepo.findByUser(userId),
  get: (id) => notificationRepo.findById(id),
  update: (id, data) => notificationRepo.update(id, data),
  remove: (id) => notificationRepo.remove(id),
};
