import { employeeService } from "../services/employeeService.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Branch from "../models/Branch.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Company from "../models/Company.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";

dotenv.config();

// ========== Create Employee (direct) ==========
export const createEmployee = async (req, res, next) => {
  try {
    res.status(201).json(await employeeService.create(req.body));
  } catch (err) {
    next(err);
  }
};

// ========== List Employees by Branch ==========
export const listEmployeesByBranch = async (req, res, next) => {
  try {
    const employees = await Employee.find({ branch: req.params.branchId })

      .populate("branch");
    res.json(employees);
  } catch (err) {
    next(err);
  }
};
export const listEmployeesByCompany = async (req, res, next) => {
  try {
    const companyId = req.params.companyId;
    const employees = await Employee.find({ company: companyId }).populate(
      "branch"
    );
    res.status(200).json(employees);
  } catch (err) {
    next(err);
  }
};

// ========== Get Single Employee ==========
export const getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ user: req.params.id });

    // .populate("branch");
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    next(err);
  }
};

// ========== Update/Delete Employee ==========
export const updateEmployee = async (req, res, next) => {
  try {
    const { branch, workMode, officeStartTime, officeEndTime } = req.body;
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    if (branch) employee.branch = branch;
    if (workMode) employee.workMode = workMode;
    if (officeStartTime) employee.officeStartTime = officeStartTime;
    if (officeEndTime) employee.officeEndTime = officeEndTime;

    // optional: ensure start < end
    if (employee.officeStartTime && employee.officeEndTime) {
      if (employee.officeStartTime >= employee.officeEndTime) {
        return res.status(400).json({
          message: "officeEndTime must be later than officeStartTime",
        });
      }
    }
    await employee.save();

    res.json({ message: "Employee updated", employee });
  } catch (err) {
    next(err);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    await User.findByIdAndDelete(employee.email);
    await employee.deleteOne();

    res.json({ message: "Employee deleted" });
  } catch (err) {
    next(err);
  }
};

// ========== Invite Employee ==========
export const inviteEmployee = async (req, res, next) => {
  try {
    const { email, branchId, workType, homeLocation } = req.body;

    // check branch
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // check existing user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const companyId = req.user.companyId || branch.company;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // create user (inactive until registration)
    user = new User({
      name: email.split("@")[0],
      email,
      role: "EMPLOYEE",
      companyId: req.user.companyId, // from token
      branch: branchId,
      password: "temp", // placeholder, replaced at registration
    });
    await user.save();

    // create employee profile
    const employee = new Employee({
      name: user.name,
      email: user.email,
      password: user.password,
      workMode: workType || "OFFICE",
      //address: homeLocation || "Not Provided",
      company: companyId,
      branch: branchId,
      user: user._id,
    });
    await employee.save();

    // create invite token
    const token = jwt.sign({ email, branchId }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
    const frontendBaseUrl =
      process.env.FRONTEND_BASE_URL || "http://localhost:5173";
    const inviteUrl = `${frontendBaseUrl}/register-employees/${token}`;
    await sendEmail({
      to: email,
      subject: "You're invited to join EasyGo",
      html: `<p>Hello,<br>
        You have been invited to join EasyGo as an employee.<br>
        Click <a href="${inviteUrl}">here</a> to register your account.<br>
        This link will expire in 2 days.</p>`,
    });

    // normally send email with token, here just respond
    res.status(200).json({
      message: "Invitation sent",
      inviteToken: token,
    });
  } catch (err) {
    next(err);
  }
};

// =======================
// Register Employee
// =======================
export const registerEmployeeFromInvite = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { name, password, address } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired invite" });
    }

    if (user.password !== "temp") {
      return res.status(400).json({ message: "User already registered" });
    }

    user.name = name;
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    const employee = await Employee.findOne({ user: user._id });
    if (employee) {
      employee.name = name;
      employee.password = user.password;
      employee.address = address;
      await employee.save();
    }

    res.status(201).json({
      message: "Employee registered successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const updateEmployeeProfile = async (req, res, next) => {
  try {
    const { name, address, workMode, officeStartTime, officeEndTime } =
      req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    await user.save();

    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    if (address) employee.address = address;
    if (workMode) employee.workMode = workMode;

    if (officeStartTime) employee.officeStartTime = officeStartTime;
    if (officeEndTime) employee.officeEndTime = officeEndTime;

    if (employee.officeStartTime && employee.officeEndTime) {
      if (employee.officeStartTime >= employee.officeEndTime) {
        return res.status(400).json({
          message: "officeEndTime must be later than officeStartTime",
        });
      }
    }
    await employee.save();

    res.json({ message: "Profile updated", user, employee });
  } catch (err) {
    next(err);
  }
};
