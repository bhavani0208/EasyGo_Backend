import express from "express";
import { validate } from "../middlewares/validator.js";
import { createBranchSchema } from "../validators/schemas.js";
import {
  createBranch,
  listBranchesByCompany,
  getBranch,
  updateBranch,
  deleteBranch,
  listBranches,
} from "../controllers/branchController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import {
  canAccessCompanyParam,
  canAccessCompanyOfEntity,
} from "../middlewares/scopeMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Branches
 *     description: Manage branches of companies
 */

/**
 * @openapi
 * /api/branches:
 *   post:
 *     summary: Create a new branch
 *     description: Only SUPERADMIN or Admin of the company can create branches.
 *     tags: [Branches]
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
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: Hyderabad Branch
 *               address:
 *                 type: string
 *                 example: Hyderabad
 *     responses:
 *       "201":
 *         description: Branch created successfully
 *
 */

router.post(
  "/",
  protect,
  authorize("SUPERADMIN", "ADMIN"),
  validate(createBranchSchema),
  canAccessCompanyParam,
  createBranch
);

/**
 * @swagger
 * /api/branches:
 *   get:
 *     summary: List all branches
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of branches
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
 *                     example: Kondapur
 *       401:
 *         description: Unauthorized
 */
// Anyone logged in can view companies (needed for Admin registration)
router.get("/", listBranches);

/**
 * @openapi
 * /api/branches/company/{companyId}:
 *   get:
 *     summary: List branches by company
 *     description: Only SUPERADMIN or Admin of the company can view.
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the company
 *     responses:
 *       "200":
 *         description: List of branches
 *
 */
router.get(
  "/company/:companyId",
  protect,
  authorize("SUPERADMIN", "ADMIN"),
  canAccessCompanyParam,
  listBranchesByCompany
);

/**
 * @openapi
 * /api/branches/{id}:
 *   get:
 *     summary: Get branch by ID
 *     description: SUPERADMIN or Admin of same company.
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *     responses:
 *       "200":
 *         description: Branch object
 *
 */
router.get(
  "/:id",
  protect,
  authorize("SUPERADMIN", "ADMIN"),
  canAccessCompanyOfEntity("branch"),
  getBranch
);

/**
 * @openapi
 * /api/branches/{id}:
 *   put:
 *     summary: Update branch by ID
 *     description: SUPERADMIN or Admin of same company.
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Branch Name
 *               location:
 *                 type: string
 *                 example: Updated Location
 *     responses:
 *       "200":
 *         description: Branch updated
 *
 */
router.put(
  "/:id",
  protect,
  authorize("SUPERADMIN", "ADMIN"),
  canAccessCompanyOfEntity("branch"),
  updateBranch
);
/**
 * @openapi
 * /api/branches/{id}:
 *   delete:
 *     summary: Delete branch by ID
 *     description: SUPERADMIN or Admin of same company.
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *     responses:
 *       "200":
 *         description: Branch deleted
 *
 */
router.delete(
  "/:id",
  protect,
  authorize("SUPERADMIN", "ADMIN"),
  canAccessCompanyOfEntity("branch"),
  deleteBranch
);

export default router;
