import mongoose from "mongoose";

const inviteTokenSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    role: { type: String, enum: ["ADMIN", "EMPLOYEE"], required: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" }, // required if EMPLOYEE
    token: { type: String, unique: true, required: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

inviteTokenSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { usedAt: { $exists: false } },
  }
);

export default mongoose.model("InviteToken", inviteTokenSchema);
