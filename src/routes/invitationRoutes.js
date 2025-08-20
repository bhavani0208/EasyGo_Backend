import { Router } from "express";
import { createInvitation, acceptInvitation } from "../controllers/invitationController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { requireRoles } from "../middlewares/roleMiddleware.js";
import { canAccessCompanyParam } from "../middlewares/scopeMiddleware.js";
import { validate } from "../middlewares/validator.js";
import { inviteCreateSchema, inviteAcceptSchema } from "../validators/schemas.js";

const router = Router();

/**
 * @swagger
 * tags: [Invitations]
 */

/**
 * @swagger
 * /invitations:
 *   post:
 *     summary: Create invitation (SUPERADMIN or Admin of the company)
 *     tags: [Invitations]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, role, company]
 *             properties:
 *               email: { type: string }
 *               role: { type: string, enum: [ADMIN, EMPLOYEE] }
 *               company: { type: string }
 *               branch: { type: string, description: "Required if role=EMPLOYEE" }
 *               frontendUrl: { type: string, description: "Optional override for invite link base URL" }
 *     responses: { 201: { description: Created } }
 */
router.post("/", requireAuth, requireRoles("SUPERADMIN", "ADMIN"), canAccessCompanyParam, validate(inviteCreateSchema), createInvitation);

/**
 * @swagger
 * /invitations/accept:
 *   post:
 *     summary: Accept invitation with token (public)
 *     tags: [Invitations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token: { type: string }
 *               name: { type: string }
 *               password: { type: string }
 *               homeLocation: { type: string }
 *     responses: { 201: { description: Registered } }
 */
router.post("/accept", validate(inviteAcceptSchema), acceptInvitation);

export default router;
