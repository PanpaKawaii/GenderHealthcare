const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultationScheduleSchema = new Schema({
    counselorId: { type: Schema.Types.ObjectId, ref: 'Counselor', required: true },
    startTime: Date,
    endTime: Date,
    status: { type: String, enum: ['available', 'booked', 'completed', 'cancelled'] },
    note: String,
    price: {type: Number, required: true}
}, { timestamps: true });

module.exports = mongoose.model('ConsultationSchedule', consultationScheduleSchema);
