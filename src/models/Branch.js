// // src/models/Branch.js
// import mongoose from "mongoose";
// import { geocodeAddress } from "../utils/geocode.js";

// const branchSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, unique: true },
//     address: { type: String, required: true },
//     company: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Company",
//       required: true,
//     },
//     // GeoJSON Point: [lng, lat]
//     location: {
//       type: { type: String, enum: ["Point"], default: "Point" },
//       coordinates: {
//         type: [Number], // [longitude, latitude]
//         validate: {
//           validator(val) {
//             return (
//               !val ||
//               (val.length === 2 && val.every((n) => typeof n === "number"))
//             );
//           },
//           message: "Coordinates must be [longitude, latitude]",
//         },
//       },
//     },
//   },
//   { timestamps: true }
// );

// branchSchema.index({ location: "2dsphere" });

// /**
//  * Auto-geocode before save when address exists and coordinates not set.
//  */
// branchSchema.pre("save", async function (next) {
//   try {
//     if (this.isModified("address") || !this?.location?.coordinates?.length) {
//       if (this.address) {
//         const coords = await geocodeAddress(this.address); // [lng, lat] or null
//         if (coords && coords.length === 2) {
//           this.location = { type: "Point", coordinates: coords };
//         }
//       }
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// export default mongoose.model("Branch", branchSchema);
import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true }, // could be address or coordinates
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin or SuperAdmin
  },
  { timestamps: true }
);

export default mongoose.model("Branch", branchSchema);
