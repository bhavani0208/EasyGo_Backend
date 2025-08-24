import express from "express";
import {
  inviteEmployee,
  registerEmployeeFromInvite,
  getEmployee,
  updateEmployeeProfile,
  updateEmployee,
  deleteEmployee,
  listEmployeesByBranch,
} from "../controllers/employeeController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validator.js";

import { inviteCreateSchema,inviteAcceptSchema,updateEmployeeSchema } from "../validators/schemas.js";
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Employees
 *     description: Employee management & self-registration
 */

/**
 * @openapi
 * /api/employees/invite:
 *   post:
 *     summary: Invite an employee (Admin or Superadmin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, branchId]
 *             properties:
 *               email: { type: string, example: "employee@example.com" }
 *               branchId: { type: string, example: "66aaf9d1234567890abcde12" }
 *               workType: { type: string, enum: [HOME, OFFICE, HYBRID], example: "HYBRID" }
 *     responses:
 *       "200": { description: Invitation sent }
 */
router.post(
  "/invite",
  protect,
  authorize("SUPERADMIN","ADMIN"),
  validate(inviteCreateSchema),
  inviteEmployee
);

/**
 * @openapi
 * /api/employees/register/{token}:
 *   post:
 *     summary: Employee registration from invite
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, password, address]
 *             properties:
 *               name: { type: string, example: "John Doe" }
 *               password: { type: string, example: "securePass123" }
 *               address: { type: string, example: "Madhapur, Hyderabad" }
 *     responses:
 *       "201": { description: Employee registered }
 */
router.post("/register/:token",validate(inviteAcceptSchema), registerEmployeeFromInvite);

/**
 * @openapi
 * /api/employees/branch/{branchId}:
 *   get:
 *     summary: List employees by branch (Admin or Superadmin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       "200": { description: OK }
 */
router.get(
  "/branch/:branchId",
  protect,
  authorize("SUPERADMIN","ADMIN"),
  listEmployeesByBranch
);

/**
 * @openapi
 * /api/employees/{id}:
 *   get:
 *     summary: Get employee details (self, admin, or superadmin)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       "200": { description: OK }
 */
router.get(
  "/:id",
  protect,
  authorize("SUPERADMIN", "ADMIN", "EMPLOYEE"),
  getEmployee
);

/**
 * @openapi
 * /api/employees/profile:
 *   put:
 *     summary: Update own employee profile
 *     description: Employees can update their name, address, or work mode.
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               address: { type: string }
 *               workMode: { type: string, enum: [HOME, OFFICE, HYBRID] }
 *     responses:
 *       "200": { description: Profile updated }
 */
router.put("/profile", protect, authorize("EMPLOYEE"), updateEmployeeProfile);

/**
 * @openapi
 * /api/employees/{id}:
 *   put:
 *     summary: Update employee (Admin or Superadmin)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branch: { type: string }
 *               workMode: { type: string, enum: [HOME, OFFICE, HYBRID] }
 *             officeTimings:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     description: Office start time (HH:mm, 24hr)
 *                     example: "09:00"
 *                   end:
 *                     type: string
 *                     description: Office end time (HH:mm, 24hr)
 *                     example: "18:00"  
 *     responses:
 *       "200": { description: Employee updated }
 */
router.put("/:id", protect, authorize("SUPERADMIN", "ADMIN"),validate(updateEmployeeSchema),   updateEmployee);

/**
 * @openapi
 * /api/employees/{id}:
 *   delete:
 *     summary: Delete an employee (Admin or Superadmin)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       "200": { description: Employee deleted }
 */
router.delete(
  "/:id",
  protect,
  authorize("SUPERADMIN", "ADMIN"),
  deleteEmployee
);

//router.put("/profile", protect, authorize("EMPLOYEE"), updateEmployeeProfile);


export default router;
