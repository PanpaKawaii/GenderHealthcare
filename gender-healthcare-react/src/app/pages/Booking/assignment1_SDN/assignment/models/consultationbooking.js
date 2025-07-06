const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultationBookingSchema = new Schema({
  note: { type: String, default: null },
  rating: { type: Number, default: null },
  feedback: { type: String, default: null },
  status: { type: String, enum: ['confirmed', 'completed', 'cancelled'] },
  result: { type: String, default: null },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  scheduleId: { type: Schema.Types.ObjectId, ref: 'ConsultationSchedule', unique: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ConsultationBooking', consultationBookingSchema);