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
