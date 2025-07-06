const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testbookingSchema = new Schema({
  customerId:     { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  doctorTestServiceId:  { type: Schema.Types.ObjectId, ref: 'DoctorTestService', required: true },
  bookingDate:    Date,
  status:         { type: String, enum: ['Pending', 'Occurring', 'Finished', 'Canceled'], default: 'Pending' },
  note:           String
},{
  timestamps: true
});

module.exports = mongoose.model('TestBooking', testbookingSchema);
