import { Router } from "express";
import {
  createEmployee, listEmployeesByBranch, getEmployee, updateEmployee, deleteEmployee
} from "../controllers/employeeController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { requireRoles } from "../middlewares/roleMiddleware.js";
import { canAccessCompanyOfEntity } from "../middlewares/scopeMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags: [Employees]
 */

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create employee (SUPERADMIN or Admin of the company)
 *     tags: [Employees]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user, branch]
 *             properties:
 *               user: { type: string }
 *               branch: { type: string }
 *               workType: { type: string, enum: [HOME, HYBRID, OFFICE] }
 *               homeLocation: { type: string }
 *     responses: { 201: { description: Created } }
 */
router.post("/", requireAuth, requireRoles("SUPERADMIN", "ADMIN"), canAccessCompanyOfEntity("employee"), createEmployee);

/**
 * @swagger
 * /employees/branch/{branchId}:
 *   get:
 *     summary: List employees by branch (SUPERADMIN or Admin of same company)
 *     tags: [Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [ { in: path, name: branchId, required: true, schema: { type: string } } ]
 *     responses: { 200: { description: OK } }
 */
router.get("/branch/:branchId", requireAuth, requireRoles("SUPERADMIN", "ADMIN"), canAccessCompanyOfEntity("employee"), listEmployeesByBranch);

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get employee (SUPERADMIN, Admin of same company, or the Employee themself)
 *     tags: [Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [ { in: path, name: id, required: true, schema: { type: string } } ]
 *     responses: { 200: { description: OK } }
 */
router.get("/:id", requireAuth, canAccessCompanyOfEntity("employee"), getEmployee);

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Update employee (SUPERADMIN, Admin of same company, or the Employee themself - limited fields)
 *     tags: [Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [ { in: path, name: id, required: true, schema: { type: string } } ]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workType: { type: string, enum: [HOME, HYBRID, OFFICE] }
 *               homeLocation: { type: string }
 *               branch: { type: string, description: "Admins/Superadmins only" }
 *     responses: { 200: { description: OK } }
 */
router.put("/:id", requireAuth, canAccessCompanyOfEntity("employee"), updateEmployee);

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete employee (SUPERADMIN or Admin of same company)
 *     tags: [Employees]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [ { in: path, name: id, required: true, schema: { type: string } } ]
 *     responses: { 200: { description: Deleted } }
 */
router.delete("/:id", requireAuth, requireRoles("SUPERADMIN", "ADMIN"), canAccessCompanyOfEntity("employee"), deleteEmployee);

export default router;
