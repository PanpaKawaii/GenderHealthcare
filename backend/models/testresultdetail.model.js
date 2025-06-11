const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testresultdetailSchema = new Schema({
  testResultId:   { type: Schema.Types.ObjectId, ref: 'TestResult', required: true },
  parameterId:    { type: Schema.Types.ObjectId, ref: 'Parameter', required: true },
  value:          Number,
},{
  timestamps: true
});

module.exports = mongoose.model('TestResultDetail', testresultdetailSchema);
