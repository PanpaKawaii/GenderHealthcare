const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorTestServiceSchema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    testServiceId: {
      type: Schema.Types.ObjectId,
      ref: "TestService",
      required: true,
    },
    // Thêm các trường phụ nếu cần, ví dụ:
    // price: { type: Number },
    // note: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DoctorTestService", doctorTestServiceSchema);
