import { employeeService } from "../services/employeeService.js";

export const createEmployee = async (req, res, next) => {
  try { res.status(201).json(await employeeService.create(req.body)); }
  catch (err) { next(err); }
};

export const listEmployeesByBranch = async (req, res, next) => {
  try { res.json(await employeeService.listByBranch(req.params.branchId)); }
  catch (err) { next(err); }
};

export const getEmployee = async (req, res, next) => {
  try { res.json(await employeeService.get(req.params.id)); }
  catch (err) { next(err); }
};

export const updateEmployee = async (req, res, next) => {
  try {
    // If EMPLOYEE, allow only limited fields (self updates handled by route guard)
    if (req.user?.role === "EMPLOYEE") {
      const allowed = {};
      if ("homeLocation" in req.body) allowed.homeLocation = req.body.homeLocation;
      if ("workType" in req.body) allowed.workType = req.body.workType;
      return res.json(await employeeService.update(req.params.id, allowed));
    }
    res.json(await employeeService.update(req.params.id, req.body));
  } catch (err) { next(err); }
};

export const deleteEmployee = async (req, res, next) => {
  try { await employeeService.remove(req.params.id); res.json({ message: "Employee deleted" }); }
  catch (err) { next(err); }
};
