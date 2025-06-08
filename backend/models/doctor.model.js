const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema(
  {
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    bio: { type: String },
    isActive: { type: Boolean, default: true },
    medicalfacilityId: {
      type: Schema.Types.ObjectId,
      ref: "MedicalFacilities",
      //   unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
