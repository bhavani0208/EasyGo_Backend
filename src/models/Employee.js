import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    user: {
      // add this field
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workMode: {
      type: String,
      enum: ["OFFICE", "HYBRID", "REMOTE"],
      default: "OFFICE",
    },

    address: { type: String, require: false }, // employee home address
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
    officeStartTime: {
      type: String,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format, use HH:mm"],
    },
    officeEndTime: {
      type: String,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format, use HH:mm"],
    },
    workDays: [{ type: String }],
  },
  { timestamps: true }
);

employeeSchema.index({ location: "2dsphere" });

export default mongoose.model("Employee", employeeSchema);
