const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reminderSchema = new Schema(
  {
    type: { type: String, required: true }, // Ví dụ: "Pill", "Ovulation", "Event"...
    date: { type: Date, required: true },
    message: String,
    isSent: { type: Boolean, default: false },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", reminderSchema);
