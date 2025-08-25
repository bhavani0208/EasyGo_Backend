
import Company from "../models/Company.js";
import{companyService} from "../services/companyService.js";
import { companyRepo } from "../repositories/companyRepo.js";

// SuperAdmin: add company
export const createCompany = async (req, res, next) => {
  try {
    const { name } = req.body;

    // check unique
    const existing = await Company.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Company already exists" });
    }

    const company = await Company.create({
      name,
      createdBy: req.user.id, // from middleware
    });

    res.status(201).json(company);
  } catch (err) {
    next(err);
  }
};

// List companies (for Admin registration dropdown)
export const listCompanies  = async (req, res, next) => {
  try {
    console.log("Listing companies");
    const companies = await companyService.list()
    res.json(companies);
  } catch (err) {
    next(err);
  }
  // try {
  //   const companies = await companyRepo.findAll();
  //   res.json(companies.map(c => ({ id: c._id, name: c.name })));
  // } catch (err) {
  //   next(err);
  // }
};
export const getCompany = async (req, res, next) => {
  try {
    const company = await companyService.get(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (err) {
    next(err);
  }
};
export const updateCompany = async (req, res, next) => {
  try {
    const updated = await companyService.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
export const deleteCompany = async (req, res, next) => {
  try {
    const deleted = await companyService.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json({ message: "Company deleted" });
  } catch (err) {
    next(err);
  }
};
