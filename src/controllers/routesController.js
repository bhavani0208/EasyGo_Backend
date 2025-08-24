import { routesService } from "../services/routesService.js";

export const getRouteByCoords = async (req, res, next) => {
  try {
    const { start, end, profile } = req.body;
    // start/end: { lat, lng }
    const result = await routesService.getByCoords(start, end, profile);
    res.json(result);
  } catch (err) { next(err); }
};

export const getRouteForEmployee = async (req, res, next) => {
  try {
    const { profile } = req.query;
    const result = await routesService.getForEmployee(
      req.params.employeeId,
      profile
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};
export const notifyEmployeeRoute = async (req, res, next) => {
  try {
    const { profile } = req.query;
    const result = await routesService.notifyEmployeeRoute(
      req.params.employeeId,
      profile
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};
