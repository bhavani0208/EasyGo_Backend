import { employeeRepo } from "../repositories/employeeRepo.js";
import { geocodeAddress } from "../utils/geocode.js";

export const employeeService = {
  async registerEmployee(data) {
    // 1. Convert address -> coordinates
    const coordinates = await geocodeAddress(data.address);

    const employeeData = {
      ...data,
        officeStartTime: data.officeStartTime,
    officeEndTime: data.officeEndTime,
    workDays: data.workDays || ["Mon", "Tue", "Wed", "Thu", "Fri"],
      location: {
        type: "Point",
        coordinates: coordinates || [0, 0], // fallback
      },
    };

    // 2. Save in DB
    return await employeeRepo.create(employeeData);
  },
  //create: (data) => employeeRepo.create(data),
  listByBranch: (branchId) => employeeRepo.findByBranch(branchId),
  get: (id) => employeeRepo.findById(id),
  update: async (id, data) => {
    const update = { ...data };

    // If user sent a simple address string, geocode here
    if (typeof data.homeAddress === "string" && data.homeAddress.trim()) {
      const coords = await geocodeAddress(data.homeAddress.trim());
      if (coords) {
        update.homeLocation = { type: "Point", coordinates: coords };
      }
      delete update.homeAddress;
    }

    const emp = await Employee.findByIdAndUpdate(id, update, {
      new: true,
    }).populate("company branch");
    if (!emp) {
      const err = new Error("Employee not found");
      err.status = 404;
      throw err;
    }
    return emp;
  },
  remove: (id) => employeeRepo.remove(id),
  getByUser: (userId) => employeeRepo.findByUserId(userId),
};
