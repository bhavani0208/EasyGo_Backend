import mongoose from "mongoose";
import { branchService } from "../services/branchService.js";

export const createBranch = async (req, res, next) => {
  try {
    let payload = { ...req.body };

    // If ADMIN → force their own company
    if (req.user.role === "ADMIN") {
      payload.companyId = req.user.companyId;
    }

    // If SUPERADMIN → require companyId in request
    if (req.user.role === "SUPERADMIN" && !payload.companyId) {
      return res.status(400).json({ message: "companyId is required for SUPERADMIN" });
    }

    // Convert companyId → ObjectId and move to company field
    if (payload.companyId) {
      payload.company = new mongoose.Types.ObjectId(payload.companyId);
      delete payload.companyId;
    }

    // Save who created it
    payload.createdBy = req.user._id;

    console.log("✅ Final branch payload:", payload);

    const branch = await branchService.create(payload);
    res.status(201).json(branch);
  } catch (err) {
    console.error("❌ Branch creation error:", err);
    next(err);
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
