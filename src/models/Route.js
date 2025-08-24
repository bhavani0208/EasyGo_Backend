
import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    from: { type: String, required: true },       // home location
    to: { type: String, required: true },         // office/branch location
    distance: { type: Number },                   // in km
    duration: { type: Number },                   // in minutes
    trafficLevel: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "LOW" },
    polyline: { type: String },                   // encoded path if returned by API
  },
  { timestamps: true }
);

export default mongoose.model("Route", routeSchema);
