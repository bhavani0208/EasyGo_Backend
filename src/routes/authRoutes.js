import express from "express";
import { login, registerAdmin } from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and registration
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user (SuperAdmin, Admin, or Employee)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: superadmin@example.com
 *               password:
 *                 type: string
 *                 example: superadmin123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 role:
 *                   type: string
 *                   example: SUPERADMIN
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid credentials
 */

router.post("/login", login);

/**
 * @swagger
 * /api/auth/register-admin:
 *   post:
 *     summary: Self register a new Admin under an existing company
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - companyId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alice Admin
 *               email:
 *                 type: string
 *                 example: alice@company.com
 *               password:
 *                 type: string
 *                 example: admin123
 *               companyId:
 *                 type: string
 *                 example: 64e12a6bc1234ab567890def
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Invalid company or email already used
 */

router.post("/register-admin", registerAdmin);

export default router;
