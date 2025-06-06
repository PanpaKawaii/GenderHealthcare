const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  accountId:   { type: Schema.Types.ObjectId, ref: 'Account', unique: true, required: true },
  dateOfBirth: Date,
  address:     String,
},{
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);//ref theo model
