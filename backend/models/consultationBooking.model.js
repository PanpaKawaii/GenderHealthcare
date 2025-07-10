const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultationBookingSchema = new Schema({
    note: String,
    rating: Number,
    feedback: String,
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'] },
    result: String,
    bookingDate: {type: Date, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    scheduleId: { type: Schema.Types.ObjectId, ref: 'ConsultationSchedule', required: true }
}, { timestamps: true });

module.exports = mongoose.model('ConsultationBooking', consultationBookingSchema);