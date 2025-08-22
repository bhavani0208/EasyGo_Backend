import { employeeService } from "../services/employeeService.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// ========== Create Employee ==========
export const createEmployee = async (req, res, next) => {
  try {
    res.status(201).json(await employeeService.create(req.body));
  } catch (err) {
    next(err);
  }
};

// ========== List Employees ==========
export const listEmployeesByBranch = async (req, res, next) => {
  try {
    res.json(await employeeService.listByBranch(req.params.branchId));
  } catch (err) {
    next(err);
  }
};

export const getEmployee = async (req, res, next) => {
  try {
    res.json(await employeeService.get(req.params.id));
  } catch (err) {
    next(err);
  }
};

// ========== Update/Delete Employee ==========
export const updateEmployee = async (req, res, next) => {
  try {
    if (req.user?.role === "EMPLOYEE") {
      const allowed = {};
      if ("homeLocation" in req.body)
        allowed.homeLocation = req.body.homeLocation;
      if ("workType" in req.body) allowed.workType = req.body.workType;
      return res.json(await employeeService.update(req.params.id, allowed));
    }
    res.json(await employeeService.update(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    await employeeService.remove(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    next(err);
  }
};

// ========== Invite Employee ==========
export const inviteEmployee = async (req, res) => {
  try {
    const { email, branch, workType, homeLocation } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({
      name: email.split("@")[0],
      email,
      role: "EMPLOYEE",
      company: req.user.companyId,
    });
    await user.save();

    const employee = new Employee({
      user: user._id,
      branch,
      workType,
      homeLocation,
    });
    await employee.save();

    // Generate invite token valid for 7 days
    const token = jwt.sign(
      { userId: user._id, email, role: "EMPLOYEE" },
      env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Employee invited successfully",
      employee,
      inviteToken: token, // in real world you’d email this
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== Register From Invite ==========
export const registerEmployeeFromInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const { name, password, homeLocation } = req.body;

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).json({ message: "Invalid invite" });

    user.name = name;
    user.password = password; // should be hashed by User model pre-save hook
    await user.save();

    const employee = await Employee.findOne({ user: user._id });
    if (employee) {
      employee.homeLocation = homeLocation;
      await employee.save();
    }

    res
      .status(201)
      .json({ message: "Employee registered successfully", user, employee });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ========== Update Own Profile ==========
export const updateEmployeeProfile = async (req, res, next) => {
  try {
    const updates = {};
    if ("name" in req.body) updates.name = req.body.name;
    if ("homeLocation" in req.body)
      updates.homeLocation = req.body.homeLocation;
    if ("workType" in req.body) updates.workType = req.body.workType;

    const employee = await employeeService.update(req.user.id, updates);
    res.json({ message: "Profile updated", employee });
  } catch (err) {
    next(err);
  }
};
