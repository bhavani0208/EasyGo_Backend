import { notificationRepo } from "../repositories/notificationRepo.js";

export const notificationService = {
  // Backwards compatible (data is optional)
  create: (user, message, type = "INFO", data = null) =>
    notificationRepo.create({ user, message, type, data }),

  listForUser: (userId) => notificationRepo.findByUser(userId),
  get: (id) => notificationRepo.findById(id),
  update: (id, data) => notificationRepo.update(id, data),
  remove: (id) => notificationRepo.remove(id),
};
