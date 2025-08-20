import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import User from "../models/User.js";
import Company from "../models/Company.js";
import Branch from "../models/Branch.js";
import bcrypt from "bcryptjs";

(async () => {
  try {
    await connectDB();

    // seed superadmin
    const email = process.env.SUPERADMIN_EMAIL || "superadmin@example.com";
    const password = process.env.SUPERADMIN_PASSWORD || "Passw0rd!";
    const name = process.env.SUPERADMIN_NAME || "Root User";

    let superadmin = await User.findOne({ email });
    if (!superadmin) {
      superadmin = await User.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: "SUPERADMIN",
      });
      console.log("✅ SuperAdmin created:", email);
    } else {
      console.log("ℹ️ SuperAdmin exists:", email);
    }

    // demo company & admin & branch
    let company = await Company.findOne({ name: "DemoCorp" });
    if (!company) {
      company = await Company.create({ name: "DemoCorp" });
      console.log("✅ Company created: DemoCorp");
    }

    let admin = await User.findOne({ email: "admin@democorp.com" });
    if (!admin) {
      admin = await User.create({
        name: "Demo Admin",
        email: "admin@democorp.com",
        password: await bcrypt.hash("Admin123!", 10),
        role: "ADMIN",
        company: company._id,
      });
      console.log("✅ Admin created: admin@democorp.com");
    }

    let branch = await Branch.findOne({ name: "HQ", company: company._id });
    if (!branch) {
      branch = await Branch.create({
        name: "HQ",
        address: "Demo Street 1",
        company: company._id,
      });
      console.log("✅ Branch created: HQ");
    }

    // attach company.admin if you want
    if (String(company.admin || "") !== String(admin._id)) {
      company.admin = admin._id;
      await company.save();
      console.log("🔗 Company.admin set to Demo Admin");
    }

    console.log("🎉 Seeding complete");
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
