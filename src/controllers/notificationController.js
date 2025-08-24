import { notificationService } from "../services/notificationService.js";

export const createNotification = async (req, res, next) => {
  try {
    const { user, message, type, data } = req.body;
    const notif = await notificationService.create(user, message, type, data);
    res.status(201).json(notif);
  } catch (err) {
    next(err);
  }
};

export const listMyNotifications = async (req, res, next) => {
  try {
    const list = await notificationService.listForUser(req.user.id);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const updateNotification = async (req, res, next) => {
  try {
    // allow toggling isRead and simple edits
    const { message, type, isRead, data } = req.body || {};
    const notif = await notificationService.get(req.params.id);
    if (!notif) return res.status(404).json({ message: "Not found" });
    if (String(notif.user) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ message: "You can only update your notifications" });
    }
    const updated = await notificationService.update(req.params.id, {
      ...(message !== undefined ? { message } : {}),
      ...(type !== undefined ? { type } : {}),
      ...(isRead !== undefined ? { isRead } : {}),
      ...(data !== undefined ? { data } : {}),
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const notif = await notificationService.get(req.params.id);
    if (!notif) return res.status(404).json({ message: "Not found" });
    if (String(notif.user) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ message: "You can only delete your notifications" });
    }
    await notificationService.remove(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    next(err);
  }
};
