import Employee from "../models/Employee.js";
import User from "../models/User.js";

export const employeeRepo = {
  async create(data) {
    // 1. Check if user exists
    let user = await User.findOne({ email: data.email });

    if (!user) {
      // Create new user if not found
      user = await User.create({
        email: data.email,
        role: "EMPLOYEE",
        password: "default123", // 👈 can replace with random / send invitation
      });
    }

    // 2. Check if employee already linked to this user
    let existingEmployee = await Employee.findOne({ user: user._id });
    if (existingEmployee) {
      throw new Error("Employee already exists for this user");
    }

    // 3. Create employee record
    const employee = await Employee.create({
      user: user._id,
      branch: data.branch,
      workType: data.workType,
      homeLocation: data.homeLocation,
    });

    return await employee.populate("user").populate("branch");
  },

  findById: (id) => Employee.findById(id).populate("user").populate("branch"),
  findByBranch: (branchId) =>
    Employee.find({ branch: branchId }).populate("user").populate("branch"),
  update: (id, data) => Employee.findByIdAndUpdate(id, data, { new: true }),
  remove: (id) => Employee.findByIdAndDelete(id),
  findByUserId: (userId) =>
    Employee.findOne({ user: userId }).populate("branch"),
};
