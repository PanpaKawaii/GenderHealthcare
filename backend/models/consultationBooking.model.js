const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultationBookingSchema = new Schema({
    note: String,
    rating: Number,
    feedback: String,
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'] },
    result: String,
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', unique: true, required: true },
    scheduleId: { type: Schema.Types.ObjectId, ref: 'ConsultationSchedule', unique: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ConsultationBooking', consultationBookingSchema);