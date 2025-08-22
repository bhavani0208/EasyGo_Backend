// import { companyService } from "../services/companyService.js";

// export const createCompany = async (req, res, next) => {
//   try {
//     const company = await companyService.create(req.body);
//     res.status(201).json(company);
//   } catch (err) {
//     next(err);
//   }
// };

// export const listCompanies = async (req, res, next) => {
//   try {
//     const companies = await companyService.list();
//     res.json(companies);
//   } catch (err) {
//     next(err);
//   }
// };
// export const getCompany = async (req, res, next) => {
//   try {
//     res.json(await companyService.get(req.params.id));
//   } catch (err) {
//     next(err);
//   }
// };

// export const updateCompany = async (req, res, next) => {
//   try {
//     res.json(await companyService.update(req.params.id, req.body));
//   } catch (err) {
//     next(err);
//   }
// };
// export const deleteCompany = async (req, res, next) => {
//   try {
//     await companyService.remove(req.params.id);
//     res.json({ message: "Company deleted" });
//   } catch (err) {
//     next(err);
//   }
// };

import Company from "../models/Company.js";

// SuperAdmin: add company
export const createCompany = async (req, res) => {
  try {
    const { name } = req.body;

    // check unique
    const existing = await Company.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "Company already exists" });

    const company = await Company.create({
      name,
      createdBy: req.user.id, // from middleware
    });

    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List companies (for Admin registration dropdown)
export const listCompanies = async (req, res) => {
  try {
    const companies = await Company.find().select("name _id");
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
