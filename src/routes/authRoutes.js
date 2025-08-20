import { Router } from "express";
import { register, login } from "../controllers/authController.js";

const router = Router();

/**
 * @swagger
 * tags: [Auth]
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a user (used for seeding/admin flows; in production prefer invitations)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [SUPERADMIN, ADMIN, EMPLOYEE] }
 *               company: { type: string }
 *               branch: { type: string }
 *     responses: { 201: { description: Created } }
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, required: [email, password], properties: { email: { type: string }, password: { type: string } } } } }
 *     responses: { 200: { description: OK } }
 */
router.post("/login", login);

export default router;
