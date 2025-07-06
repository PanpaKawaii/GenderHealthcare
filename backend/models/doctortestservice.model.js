const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorTestServiceSchema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    testServiceId: { type: Schema.Types.ObjectId, ref: "TestService", required: true, },
    startTime: String,
    endTime: String,
    status: { type: String, enum: ['Available', 'Unavailable'] }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DoctorTestService", doctorTestServiceSchema);
