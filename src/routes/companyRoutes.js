import express from "express";
import {
  createCompany,
  listCompanies,
} from "../controllers/companyController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Company management (SuperAdmin only for creation)
 */

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Create a new company (SuperAdmin only)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Google
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Company already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not SuperAdmin)
 */

// Only SuperAdmin can add companies
router.post("/", protect, authorize("SUPERADMIN"), createCompany);

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: List all companies
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 64e12a6bc1234ab567890def
 *                   name:
 *                     type: string
 *                     example: Google
 *       401:
 *         description: Unauthorized
 */
// Anyone logged in can view companies (needed for Admin registration)
router.get("/", protect, listCompanies);

export default router;
