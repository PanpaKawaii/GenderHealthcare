const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    processingTime: { type: Number },
    sampleType: { type: String },
    isActive: { type: Boolean, default: true },
    instructions: { type: String },
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

module.exports = mongoose.model("TestService", testServiceSchema);
