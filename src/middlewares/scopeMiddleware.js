import { companyRepo } from "../repositories/companyRepo.js";
import { branchRepo } from "../repositories/branchRepo.js";
import { employeeRepo } from "../repositories/employeeRepo.js";

export async function canAccessCompanyParam(req, res, next) {
  if (req.user.role === "SUPERADMIN") return next();

  const targetCompanyId =
    req.params.companyId || req.params.id || req.body.company;
  if (!targetCompanyId)
    return res.status(400).json({ message: "company id required" });

  if (
    req.user.role === "ADMIN" &&
    String(req.user.companyId) === String(targetCompanyId)
  ) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden: outside your company" });
}

export function canAccessCompanyOfEntity(entityType) {
  // entityType: "company" | "branch" | "employee"
  return async (req, res, next) => {
    if (req.user.role === "SUPERADMIN") return next();

    let companyId = null;

    if (entityType === "company") {
      companyId = req.params.id || req.body.company;
    } else if (entityType === "branch") {
      const id =
        req.params.id || req.params.branchId || req.body.branch || req.body.id;
      const branch = id ? await branchRepo.findById(id) : null;
      companyId = branch?.company;
      if (!companyId && req.params.companyId) companyId = req.params.companyId;
      if (!companyId && req.body.company) companyId = req.body.company;
    } else if (entityType === "employee") {
      const id = req.params.id || req.params.employeeId || req.body.employeeId;
      const employee = id ? await employeeRepo.findById(id) : null;
      // try via branch/company if creating
      let branchId = employee?.branch || req.body.branch || req.params.branchId;
      if (branchId) {
        const branch = await branchRepo.findById(branchId);
        companyId = branch?.company;
      }
    }

    if (!companyId)
      return res.status(400).json({ message: "Cannot resolve company scope" });

    if (
      req.user.role === "ADMIN" &&
      String(req.user.companyId) === String(companyId)
    ) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden: outside your company" });
  };
}

export async function canEmployeeSelf(req, res, next) {
  // allow employee to act on their own employee record or notification
  if (req.user.role !== "EMPLOYEE") return next(); // not employee → higher roles handled by other middlewares
  const targetUserId = req.params.userId || req.body.user || req.user.id;
  if (String(targetUserId) !== String(req.user.id)) {
    return res
      .status(403)
      .json({ message: "Employees can only act on themselves" });
  }
  next();
}
