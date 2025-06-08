const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medicalFacilitiesSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    openingHours: { type: String },
    establishedYear: { type: Number },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MedicalFacilities", medicalFacilitiesSchema);
