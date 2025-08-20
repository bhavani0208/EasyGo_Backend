import { Router } from "express";
import { validate } from "../middlewares/validator.js";
import { createCompanySchema } from "../validators/schemas.js";

import {
  createCompany, listCompanies, getCompany, updateCompany, deleteCompany
} from "../controllers/companyController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { requireRoles } from "../middlewares/roleMiddleware.js";
import { canAccessCompanyParam, canAccessCompanyOfEntity } from "../middlewares/scopeMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags: [Companies]
 */

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Create a company (SUPERADMIN)
 *     tags: [Companies]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, properties: { name: { type: string } }, required: [name] } } }
 *     responses: { 201: { description: Created } }
 */
router.post("/", requireAuth, requireRoles("SUPERADMIN"), validate(createCompanySchema), createCompany);

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: List companies (SUPERADMIN)
 *     tags: [Companies]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: OK } }
 */
router.get("/", requireAuth, requireRoles("SUPERADMIN"), listCompanies);

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get company by id (SUPERADMIN or Admin of same company)
 *     tags: [Companies]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [ { in: path, name: id, required: true, schema: { type: string } } ]
 *     responses: { 200: { description: OK } }
 */
router.get("/:id", requireAuth, canAccessCompanyOfEntity("company"), getCompany);

/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Update company (SUPERADMIN)
 *     tags: [Companies]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [ { in: path, name: id, required: true, schema: { type: string } } ]
 *     requestBody:
 *       content: { application/json: { schema: { type: object, properties: { name: { type: string } } } } }
 *     responses: { 200: { description: OK } }
 */
router.put("/:id", requireAuth, requireRoles("SUPERADMIN"), updateCompany);

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Delete company (SUPERADMIN)
 *     tags: [Companies]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [ { in: path, name: id, required: true, schema: { type: string } } ]
 *     responses: { 200: { description: Deleted } }
 */
router.delete("/:id", requireAuth, requireRoles("SUPERADMIN"), deleteCompany);

export default router;
