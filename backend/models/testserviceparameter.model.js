const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testserviceparameterSchema = new Schema({
  testServiceId:   { type: Schema.Types.ObjectId, ref: 'TestService', unique: true, required: true },
  parameterId:   { type: Schema.Types.ObjectId, ref: 'Parameter', unique: true, required: true }
},{
  timestamps: true
});

module.exports = mongoose.model('TestServiceParameter', testserviceparameterSchema);
