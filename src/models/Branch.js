// import mongoose from "mongoose";

// const branchSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },

//     address: { type: String, required: true }, // human-readable address

//     location: {
//       type: {
//         type: String,
//         enum: ["Point"],
//         default: "Point",
//       },
//       coordinates: {
//         type: [Number], // [lng, lat]
//         required: true,
//       },
//     },

//     company: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Company",
//       required: true,
//     },

//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// // create geospatial index
// branchSchema.index({ location: "2dsphere" });

// export default mongoose.model("Branch", branchSchema);


import mongoose from "mongoose";
const branchSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: { type: [Number] },
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
});
branchSchema.index({ company: 1, name: 1 }, { unique: true });
const Branch = mongoose.model("Branch", branchSchema);
export default Branch;
