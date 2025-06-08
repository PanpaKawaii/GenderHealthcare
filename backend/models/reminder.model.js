const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reminderSchema = new Schema({
  type:        { type: String, required: true }, // Ví dụ: "Pill", "Ovulation", "Event"...
  date:        { type: Date, required: true },
  content:     { type: String, required: true },
  status:      { type: String, enum: ['Active', 'Completed', 'Skipped'], default: 'Active' },
  customerId:  { type: Schema.Types.ObjectId, ref: 'Customer', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
