const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testbookingSchema = new Schema({
  customerId:     { type: Schema.Types.ObjectId, ref: 'Customer', unique: true, required: true },
  doctorId:       { type: Schema.Types.ObjectId, ref: 'Doctor', unique: true, required: true },
  testServiceId:  { type: Schema.Types.ObjectId, ref: 'TestService', unique: true, required: true },
  bookingDate:    Date,
  createdAt:      { type: Date, default: Date.now },
  status:         { type: String, enum: ['Pending', 'Occurring', 'Finished', 'Canceled'], default: 'Pending' },
  note:           Number
},{
  timestamps: true
});

module.exports = mongoose.model('TestBooking', testbookingSchema);
