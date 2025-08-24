import express from "express";
import { canAccessCompanyOfEntity } from "../middlewares/scopeMiddleware.js";
import { validate } from "../middlewares/validator.js";
import {
  routeByCoordsSchema,
  routeForEmployeeSchema,
  routeNotifySchema,
} from "../validators/routeSchemas.js";
import {
  getRouteByCoords,
  getRouteForEmployee,
  notifyEmployeeRoute,
} from "../controllers/routesController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Routes
 *     description: Best route computation using OpenRouteService
 */

/**
 * @swagger
 * /routes/by-coords:
 *   post:
 *     summary: Get best route between two coordinates
 *     tags: [Routes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start: { type: object, properties: { lat: {type: number}, lng: {type: number} }, required: [lat,lng] }
 *               end:   { type: object, properties: { lat: {type: number}, lng: {type: number} }, required: [lat,lng] }
 *               profile:
 *                 type: string
 *                 enum: [driving-car, driving-hgv, foot-walking, cycling-regular]
 *     responses:
 *       200:
 *         description: Route with distance/duration
 */
router.post(
  "/by-coords",
  protect,
  validate(routeByCoordsSchema),
  getRouteByCoords
);

/**
 * @swagger
 * /routes/employee/{employeeId}:
 *   get:
 *     summary: Get best route from employee home to office
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
 *         description: Route with distance/duration
 */
router.get(
  "/employee/:employeeId",
  protect,
  authorize("SUPERADMIN", "ADMIN", "EMPLOYEE"),
  canAccessCompanyOfEntity("employee"),
  validate(routeForEmployeeSchema),
  getRouteForEmployee
);

/**
 * @swagger
 * /routes/employee/{employeeId}/notify:
 *   post:
 *     summary: Compute route and send a ROUTE_UPDATE notification to the employee’s user
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
  protect,
  authorize("SUPERADMIN", "ADMIN"),
  canAccessCompanyOfEntity("employee"),
  validate(routeNotifySchema),
  notifyEmployeeRoute
);

export default router;
