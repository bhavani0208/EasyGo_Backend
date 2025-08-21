import { authService } from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
    const user = await authService.registerDirect(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
