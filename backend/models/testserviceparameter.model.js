const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testserviceparameterSchema = new Schema({
  testServiceId:   { type: Schema.Types.ObjectId, ref: 'TestService', required: true },
  parameterId:   { type: Schema.Types.ObjectId, ref: 'Parameter', required: true }
},{
  timestamps: true
});

module.exports = mongoose.model('TestServiceParameter', testserviceparameterSchema);
