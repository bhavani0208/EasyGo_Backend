// import mongoose from "mongoose";

// const companySchema = new mongoose.Schema({
//   name: { type: String, unique: true, required: true },
//   admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// }, { timestamps: true });

// export default mongoose.model("Company", companySchema);
import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // SuperAdmin
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
