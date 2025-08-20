import { branchService } from "../services/branchService.js";

export const createBranch = async (req, res, next) => {
  try { res.status(201).json(await branchService.create(req.body)); }
  catch (err) { next(err); }
};

export const listBranchesByCompany = async (req, res, next) => {
  try { res.json(await branchService.listByCompany(req.params.companyId)); }
  catch (err) { next(err); }
};

export const getBranch = async (req, res, next) => {
  try { res.json(await branchService.get(req.params.id)); }
  catch (err) { next(err); }
};

export const updateBranch = async (req, res, next) => {
  try { res.json(await branchService.update(req.params.id, req.body)); }
  catch (err) { next(err); }
};

export const deleteBranch = async (req, res, next) => {
  try { await branchService.remove(req.params.id); res.json({ message: "Branch deleted" }); }
  catch (err) { next(err); }
};
