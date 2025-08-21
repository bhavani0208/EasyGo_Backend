import Employee from "../models/Employee.js";
import User from "../models/User.js";
import { geocodeAddress } from "../utils/geocode.js";

export const employeeRepo = {
  async create(data) {
    // Expect data.user to be an ObjectId (created via invitation) or a valid user id
    const userId = data.user;
    if (!userId) throw new Error("User id is required for employee creation");

    const existingEmployee = await Employee.findOne({ user: userId });
    if (existingEmployee) {
      throw new Error("Employee already exists for this user");
    }

    // Normalize homeLocation: if string address provided, geocode to coordinates
    let homeLocation = data.homeLocation;
    if (typeof homeLocation === "string" && homeLocation.trim()) {
      const coords = await geocodeAddress(homeLocation.trim());
      if (coords) {
        homeLocation = { type: "Point", coordinates: coords };
      } else {
        homeLocation = undefined;
      }
    }

    const employee = await Employee.create({
      user: userId,
      branch: data.branch,
      workType: data.workType,
      homeLocation,
    });

    return await employee.populate("user").populate("branch");
  },

  findById: (id) => Employee.findById(id).populate("user").populate("branch"),
  findByBranch: (branchId) =>
    Employee.find({ branch: branchId }).populate("user").populate("branch"),
  async findByCompany(companyId) {
    const all = await Employee.find().populate("user").populate("branch");
    return all.filter(
      (e) => String(e.branch?.company || "") === String(companyId)
    );
  },
  update: (id, data) => Employee.findByIdAndUpdate(id, data, { new: true }),
  remove: (id) => Employee.findByIdAndDelete(id),
  findByUserId: (userId) =>
    Employee.findOne({ user: userId }).populate("branch"),
};
