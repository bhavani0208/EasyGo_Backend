import { Router } from "express";
import { validate } from "../middlewares/validator.js";
import { createBranchSchema } from "../validators/schemas.js";
import {
  createBranch, listBranchesByCompany, getBranch, updateBranch, deleteBranch
} from "../controllers/branchController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { requireRoles } from "../middlewares/roleMiddleware.js";
import { canAccessCompanyParam, canAccessCompanyOfEntity } from "../middlewares/scopeMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags: [Branches]
 */

/**
 * @swagger
 * /branches:
 *   post:
 *     summary: Create branch (SUPERADMIN or Admin of the company)
 *     tags: [Branches]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, company]
 *             properties:
 *               name: { type: string }
 *               address: { type: string }
 *               company: { type: string, description: "Company ObjectId" }
 *     responses: { 201: { description: Created } }
 */
router.post("/", requireAuth, requireRoles("SUPERADMIN", "ADMIN"), canAccessCompanyParam, validate(createBranchSchema), createBranch);

/**
 * @swagger
 * /branches/company/{companyId}:
 *   get:
 *     summary: List branches by company (SUPERADMIN or Admin of the company)
 *     tags: [Branches]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [ { in: path, name: companyId, required: true, schema: { type: string } } ]
 *     responses: { 200: { description: OK } }
 */
router.get("/company/:companyId", requireAuth, requireRoles("SUPERADMIN", "ADMIN"), canAccessCompanyParam, listBranchesByCompany);

/**
 * @swagger
 * /branches/{id}:
 *   get:
 *     summary: Get branch (SUPERADMIN or Admin of same company)
 *     tags: [Branches]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [ { in: path, name: id, required: true, schema: { type: string } } ]
 *     responses: { 200: { description: OK } }
 */
router.get("/:id", requireAuth, requireRoles("SUPERADMIN", "ADMIN"), canAccessCompanyOfEntity("branch"), getBranch);

/**
 * @swagger
 * /branches/{id}:
 *   put:
 *     summary: Update branch (SUPERADMIN or Admin of same company)
 *     tags: [Branches]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [ { in: path, name: id, required: true, schema: { type: string } } ]
 *     requestBody:
 *       content: { application/json: { schema: { type: object, properties: { name: { type: string }, address: { type: string } } } } }
 *     responses: { 200: { description: OK } }
 */
router.put("/:id", requireAuth, requireRoles("SUPERADMIN", "ADMIN"), canAccessCompanyOfEntity("branch"), updateBranch);

/**
 * @swagger
 * /branches/{id}:
 *   delete:
 *     summary: Delete branch (SUPERADMIN or Admin of same company)
 *     tags: [Branches]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [ { in: path, name: id, required: true, schema: { type: string } } ]
 *     responses: { 200: { description: Deleted } }
 */
router.delete("/:id", requireAuth, requireRoles("SUPERADMIN", "ADMIN"), canAccessCompanyOfEntity("branch"), deleteBranch);

export default router;
