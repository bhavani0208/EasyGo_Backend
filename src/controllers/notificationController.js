import { notificationService } from "../services/notificationService.js";

export const createNotification = async (req, res, next) => {
  try {
    const { user, message, type } = req.body;
    res.status(201).json(await notificationService.create(user, message, type));
  } catch (err) { next(err); }
};

export const listMyNotifications = async (req, res, next) => {
  try { res.json(await notificationService.listForUser(req.user.id)); }
  catch (err) { next(err); }
};

export const updateNotification = async (req, res, next) => {
  try {
    const notif = await notificationService.get(req.params.id);
    if (!notif) return res.status(404).json({ message: "Not found" });
    if (String(notif.user) !== String(req.user.id)) {
      return res.status(403).json({ message: "You can only modify your notifications" });
    }
    res.json(await notificationService.update(req.params.id, req.body));
  } catch (err) { next(err); }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const notif = await notificationService.get(req.params.id);
    if (!notif) return res.status(404).json({ message: "Not found" });
    if (String(notif.user) !== String(req.user.id)) {
      return res.status(403).json({ message: "You can only delete your notifications" });
    }
    await notificationService.remove(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) { next(err); }
};
