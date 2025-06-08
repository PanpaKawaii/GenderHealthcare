const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cycleSchema = new Schema({
  startDate:    { type: Date, required: true },
  cycleLength:  { type: Number, required: true }, // số ngày
  note:         String,
  customerId:   { type: Schema.Types.ObjectId, ref: 'Customer', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Cycle', cycleSchema);
