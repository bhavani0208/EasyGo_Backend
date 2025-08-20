import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["SUPERADMIN", "ADMIN", "EMPLOYEE"],
    required: true
  },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
