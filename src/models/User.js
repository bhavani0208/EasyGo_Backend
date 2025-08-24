
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
companyId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Company",
  required: function() { return this.role === "ADMIN"; }
},   
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
