
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    //role: { type: String, enum: ["EMPLOYEE"], default: "EMPLOYEE" },
    workMode: {
      type: String,
      enum: ["OFFICE", "HYBRID", "REMOTE"],
      default: "OFFICE",
    },

    address: { type: String, required: true }, // employee home address
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lon, lat]
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
  },
  { timestamps: true }
);

employeeSchema.index({ location: "2dsphere" });

export default mongoose.model("Employee", employeeSchema);
