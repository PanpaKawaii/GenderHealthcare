const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cycleSchema = new Schema(
  {
    periodDays: [{ type: Date, required: true }], // Danh sách các ngày kinh nguyệt thực tế
    notes: String,

    fertileWindow: [{ type: Date }], // Danh sách 12 ngày có khả năng thụ thai
    ovulationDate: { type: Date }, // Ngày có khả năng thụ thai cao nhất (thường là ngày rụng trứng)
    isPredicted: { type: Boolean, default: false }, // Dùng để phân biệt dữ liệu người dùng nhập vs dự đoán

    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cycle", cycleSchema);
