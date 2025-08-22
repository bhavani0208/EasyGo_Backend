import { Router } from "express";
import { validate } from "../middlewares/validator.js";
import { createBranchSchema } from "../validators/schemas.js";
import {
  createBranch,
  listBranchesByCompany,
  getBranch,
  updateBranch,
  deleteBranch,
} from "../controllers/branchController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { requireRoles } from "../middlewares/roleMiddleware.js";
import {
  canAccessCompanyParam,
  canAccessCompanyOfEntity,
} from "../middlewares/scopeMiddleware.js";

const router = Router();

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
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               companyId:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Branch created successfully
 *
 */
router.post(
  "/",
  protect,
  authorize,
  requireRoles("SUPERADMIN", "ADMIN"),
  canAccessCompanyParam,
  validate(createBranchSchema),
  createBranch
);

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
 *     responses:
 *       "200":
 *         description: List of branches
 *
 */
router.get(
  "/company/:companyId",
  protect,
  authorize,
  requireRoles("SUPERADMIN", "ADMIN"),
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
 *     responses:
 *       "200":
 *         description: Branch Object
 *
 */
router.get(
  "/:id",
  protect,
  authorize,
  requireRoles("SUPERADMIN", "ADMIN"),
  canAccessCompanyOfEntity("branch"),
  getBranch
);

/**
 * @openapi
 * /api/branches/{id}:
 *   put:
 *     summary: Update branch by Id
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Branch updated
 */
router.put(
  "/:id",
  protect,
  authorize,
  requireRoles("SUPERADMIN", "ADMIN"),
  canAccessCompanyOfEntity("branch"),
  updateBranch
);

/**
 * @openapi
 * /api/branches/{id}:
 *   delete:
 *     summary: Delete branch by Id
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
 *     responses:
 *       "200":
 *         description: Branch deleted
 */
router.delete(
  "/:id",
  protect,
  authorize,
  requireRoles("SUPERADMIN", "ADMIN"),
  canAccessCompanyOfEntity("branch"),
  deleteBranch
);

export default router;
