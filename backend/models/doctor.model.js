const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema(
  {
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    bio: { type: String },
    isActive: { type: Boolean, default: true },
    avatar: String,
    name: { type: String, required: true },
    phone: String,
    medicalfacilityId: {
      type: Schema.Types.ObjectId,
      ref: "MedicalFacilities",
      required: true,
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
