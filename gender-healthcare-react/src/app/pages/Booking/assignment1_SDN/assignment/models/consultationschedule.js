const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultationScheduleSchema = new Schema({
    counselorId: { type: Schema.Types.ObjectId, ref: 'Counselor', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['available', 'booked', 'completed', 'cancelled'] },
    note: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('ConsultationSchedule', consultationScheduleSchema);
