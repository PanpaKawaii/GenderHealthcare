const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cycleSchema = new Schema(
  {
    periodStart: { type: Date, required: true },
    periodLength: { type: Number, default: 7 },
    notes: String,
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cycle", cycleSchema);
