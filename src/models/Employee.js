import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
  workType: { type: String, enum: ["HOME", "HYBRID", "OFFICE"], default: "OFFICE" },
  // GeoJSON Point: [lng, lat]
  homeLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: undefined } // [lng, lat]
  },
}, { timestamps: true });

employeeSchema.index({ homeLocation: "2dsphere" });

export default mongoose.model("Employee", employeeSchema);
