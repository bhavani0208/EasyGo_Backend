// import Route from "../models/Route.js";

// export const routeRepo = {
//   async create(route) {
//     return await Route.create(route);
//   },

//   async findById(id) {
//     return await Route.findById(id).populate("employee");
//   },

//   async findByEmployee(employeeId) {
//     return await Route.find({ employee: employeeId }).sort({ createdAt: -1 });
//   }
// };
// repositories/routeRepo.js
import Route from "../models/Route.js";

export const routeRepo = {
  async create(route) {
    return await Route.create(route);
  },

  async findById(id) {
    return await Route.findById(id).populate("employee");
  },

  async findByEmployee(employeeId) {
    return await Route.find({ employee: employeeId }).sort({ createdAt: -1 });
  },
};
