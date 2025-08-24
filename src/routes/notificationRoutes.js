import express from "express";
import {
  createNotification,
  listMyNotifications,
  updateNotification,
  deleteNotification,
} from "../controllers/notificationController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
const router = express.Router();

/**
 * @swagger
 * tags: [Notifications]
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: List my notifications
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: OK } }
 */
router.get("/", protect, listMyNotifications);

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create notification (SUPERADMIN or ADMIN)
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user, message]
 *             properties:
 *               user: { type: string }
 *               message: { type: string }
 *               type: { type: string, enum: [INFO, ALERT, ROUTE_UPDATE] }
 *     responses: { 201: { description: Created } }
 */
router.post(
  "/",
  protect, authorize("SUPERADMIN", "ADMIN"),
  createNotification
);

/**
 * @swagger
 * /notifications/{id}:
 *   put:
 *     summary: Update my notification (e.g., mark read)
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [ { in: path, name: id, required: true, schema: { type: string } } ]
 *     requestBody:
 *       content: { application/json: { schema: { type: object, properties: { isRead: { type: boolean } } } } }
 *     responses: { 200: { description: OK } }
 */
router.put("/:id", protect, authorize, updateNotification);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete my notification
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [ { in: path, name: id, required: true, schema: { type: string } } ]
 *     responses: { 200: { description: Deleted } }
 */
router.delete("/:id", protect, authorize, deleteNotification);

export default router;
