import { branchService } from "../services/branchService.js";

// export const createBranch = async (req, res, next) => {
//   try { res.status(201).json(await branchService.create(req.body)); }
//   catch (err) { next(err); }
// };
export const createBranch = async (req, res) => {
  try {
    const branch = await branchService.createBranch(req.user, req.body);
    res.status(201).json(branch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listBranches = async (req, res) => {
  try {
    const branches = await branchService.listBranches(req.user);
    res.json(branches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listBranchesByCompany = async (req, res, next) => {
  try {
    res.json(await branchService.listByCompany(req.params.companyId));
  } catch (err) {
    next(err);
  }
};

export const getBranch = async (req, res, next) => {
  try {
    res.json(await branchService.get(req.params.id));
  } catch (err) {
    next(err);
  }
};

export const updateBranch = async (req, res, next) => {
  try {
    res.json(await branchService.update(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
};

export const deleteBranch = async (req, res, next) => {
  try {
    await branchService.remove(req.params.id);
    res.json({ message: "Branch deleted" });
  } catch (err) {
    next(err);
  }
};
