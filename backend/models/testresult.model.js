const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testresultSchema = new Schema({
  testBookingId:    { type: Schema.Types.ObjectId, ref: 'TestBooking', unique: true, required: true },
  resultDate:       { type: Date, default: Date.now },
  resultFile:       String,
  status:           { type: String, enum: ['Negative', 'Positive', 'Pending'], default: 'Pending' }
},{
  timestamps: true
});

module.exports = mongoose.model('TestResult', testresultSchema);
