import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  // GeoJSON Point: [lng, lat]
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: undefined } // [lng, lat]
  },
}, { timestamps: true });

branchSchema.index({ location: "2dsphere" });

export default mongoose.model("Branch", branchSchema);
