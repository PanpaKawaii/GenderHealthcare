const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testresultdetailSchema = new Schema({
  testResultId:   { type: Schema.Types.ObjectId, ref: 'TestResult', unique: true, required: true },
  parameterId:    { type: Schema.Types.ObjectId, ref: 'Parameter', unique: true, required: true },
  value:          Number,
},{
  timestamps: true
});

module.exports = mongoose.model('TestResultDetail', testresultdetailSchema);
