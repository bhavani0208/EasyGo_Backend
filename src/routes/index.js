import { Router } from "express";
import authRoutes from "./authRoutes.js";
import companyRoutes from "./companyRoutes.js";
import branchRoutes from "./branchRoutes.js";
import employeeRoutes from "./employeeRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
//import invitationRoutes from "./invitationRoutes.js";
import routesRoutes from "./routesRoutes.js";

const router = Router();

// /**
//  * @swagger
//  * /health:
//  *   get:
//  *     summary: Health check
//  *     tags: [System]
//  *     responses: { 200: { description: OK } }
//  */
// router.get("/health", (req, res) => res.json({ ok: true }));

router.use("/auth", authRoutes);
router.use("/companies", companyRoutes);
router.use("/branches", branchRoutes);
router.use("/employees", employeeRoutes);
router.use("/notifications", notificationRoutes);
//router.use("/invitations", invitationRoutes);
router.use("/routes", routesRoutes);

export default router;
