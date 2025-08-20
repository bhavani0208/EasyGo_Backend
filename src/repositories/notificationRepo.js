import Notification from "../models/Notification.js";

export const notificationRepo = {
  create: (data) => Notification.create(data),
  findById: (id) => Notification.findById(id),
  findByUser: (userId) => Notification.find({ user: userId }).sort({ createdAt: -1 }),
  update: (id, data) => Notification.findByIdAndUpdate(id, data, { new: true }),
  remove: (id) => Notification.findByIdAndDelete(id),
};
