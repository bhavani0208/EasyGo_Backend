import express from "express";
import {
  createCompany,
  listCompanies,
    getCompany,
  updateCompany,
  deleteCompany,
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

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Get a company by ID
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company details
 *       404:
 *         description: Company not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getCompany);

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Update a company (SuperAdmin only)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Microsoft
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       404:
 *         description: Company not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not SuperAdmin)
 */
router.put("/:id", protect, authorize("SUPERADMIN"), updateCompany);

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Delete a company (SuperAdmin only)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company deleted
 *       404:
 *         description: Company not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not SuperAdmin)
 */
router.delete("/:id", protect, authorize("SUPERADMIN"), deleteCompany);

export default router;
