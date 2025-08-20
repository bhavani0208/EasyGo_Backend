import { companyService } from "../services/companyService.js";

export const createCompany = async (req, res, next) => {
  try {
    const company = await companyService.create(req.body);
    res.status(201).json(company);
  } catch (err) {
    next(err);
  }
};

export const listCompanies = async (req, res, next) => {
  try {
    const companies = await companyService.list();
    res.json(companies);
  } catch (err) {
    next(err);
  }
};
export const getCompany = async (req, res, next) => {
  try {
    res.json(await companyService.get(req.params.id));
  } catch (err) {
    next(err);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    res.json(await companyService.update(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
};
export const deleteCompany = async (req, res, next) => {
  try {
    await companyService.remove(req.params.id);
    res.json({ message: "Company deleted" });
  } catch (err) {
    next(err);
  }
};
