import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    // GeoJSON Point: [lng, lat]
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number], // [longitude, latitude]
        validate: {
          validator: function (val) {
            return (
              !val ||
              (val.length === 2 && val.every((n) => typeof n === "number"))
            );
          },
          message: "Coordinates must be [longitude, latitude]",
        },
      },
    },
  },
  { timestamps: true }
);

branchSchema.index({ location: "2dsphere" });

export default mongoose.model("Branch", branchSchema);
