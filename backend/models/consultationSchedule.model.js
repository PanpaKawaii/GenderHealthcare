const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultationScheduleSchema = new Schema({
    counselorId: { type: Schema.Types.ObjectId, ref: 'Counselor',unique: true, required: true },
    startTime: Date,
    endTime: Date,
    status: { type: String, enum: ['available', 'booked', 'completed', 'cancelled'] },
    note: String
}, { timestamps: true });

module.exports = mongoose.model('ConsultationSchedule', consultationScheduleSchema);
