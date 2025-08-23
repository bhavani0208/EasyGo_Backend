import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existing = await User.findOne({ role: "SUPERADMIN" });
    if (existing) {
      console.log("⚠️ SuperAdmin already exists:", existing.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD, 10);

    const superAdmin = new User({
      name: process.env.SUPERADMIN_NAME,
      email: process.env.SUPERADMIN_EMAIL,
      password: hashedPassword,
      role: "SUPERADMIN",
    });

    await superAdmin.save();
    console.log("✅ SuperAdmin seeded:", superAdmin.email);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding SuperAdmin:", err.message);
    process.exit(1);
  }
};

seedSuperAdmin();
