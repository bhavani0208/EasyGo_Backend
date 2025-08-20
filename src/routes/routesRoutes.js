import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { requireRoles } from "../middlewares/roleMiddleware.js";
import { canAccessCompanyOfEntity } from "../middlewares/scopeMiddleware.js";
import { validate } from "../middlewares/validator.js";
import { routeByCoordsSchema, routeForEmployeeSchema } from "../validators/routeSchemas.js";
import { getRouteByCoords, getRouteForEmployee } from "../controllers/routesController.js";
import { notifyEmployeeRoute } from "../controllers/routesController.js";
import { routeNotifySchema } from "../validators/routeSchemas.js";

const router = Router();

/**
 * @swagger
 * tags: [Routes]
 */

/**
 * @swagger
 * /routes/coords:
 *   post:
 *     summary: Get route between two coordinates (authenticated)
 *     tags: [Routes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [start, end]
 *             properties:
 *               start:
 *                 type: object
 *                 properties: { lat: { type: number }, lng: { type: number } }
 *               end:
 *                 type: object
 *                 properties: { lat: { type: number }, lng: { type: number } }
 *               profile:
 *                 type: string
 *                 enum: [driving-car, driving-hgv, foot-walking, cycling-regular]
 *     responses:
 *       200:
 *         description: Route result
 */
router.post(
  "/coords",
  requireAuth,
  validate(routeByCoordsSchema),
  getRouteByCoords
);

/**
 * @swagger
 * /routes/employee/{employeeId}:
 *   get:
 *     summary: Get route for an employee (home -> branch)
 *     tags: [Routes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: profile
 *         schema:
 *           type: string
 *           enum: [driving-car, driving-hgv, foot-walking, cycling-regular]
 *     responses:
 *       200:
 *         description: Route result
 */
router.get(
  "/employee/:employeeId",
  requireAuth,
  // SUPERADMIN always ok; ADMIN only if employee belongs to their company; EMPLOYEE only if self (handled indirectly by scopeMiddleware due to employee->branch->company)
  requireRoles("SUPERADMIN", "ADMIN", "EMPLOYEE"),
  canAccessCompanyOfEntity("employee"),
  validate(routeForEmployeeSchema),
  getRouteForEmployee
);

/**
 * @swagger
 * /routes/employee/{employeeId}/notify:
 *   post:
 *     summary: Generate route and notify the employee
 *     tags: [Routes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: profile
 *         schema:
 *           type: string
 *           enum: [driving-car, driving-hgv, foot-walking, cycling-regular]
 *     responses:
 *       200:
 *         description: Notification created with route summary
 */
router.post(
  "/employee/:employeeId/notify",
  requireAuth,
  requireRoles("SUPERADMIN", "ADMIN"), // only admins trigger
  canAccessCompanyOfEntity("employee"),
  validate(routeNotifySchema),
  notifyEmployeeRoute
);


export default router;
