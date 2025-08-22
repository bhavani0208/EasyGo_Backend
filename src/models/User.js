// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, unique: true, required: true },
//     password: { type: String, required: true },
//     role: {
//       type: String,
//       enum: ["SUPERADMIN", "ADMIN", "EMPLOYEE"],
//       required: true,
//     },

//     company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
//     branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
//   },
//   { timestamps: true }
// );
// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Add comparePassword method
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["SUPERADMIN", "ADMIN", "EMPLOYEE"],
      required: true,
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    workMode: {
      type: String,
      enum: ["REMOTE", "HYBRID", "OFFICE"],
      default: "OFFICE",
    },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
