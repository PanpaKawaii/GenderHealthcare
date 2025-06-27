const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testScheduleSchema = new Schema({
    doctorTestServiceId: { type: Schema.Types.ObjectId, ref: 'DoctorTestService', required: true },
    startTime: String,
    endTime: String,
    status: { type: String, enum: ['Available', 'Unavailable'] }
}, { timestamps: true });

module.exports = mongoose.model('TestSchedule', testScheduleSchema);
