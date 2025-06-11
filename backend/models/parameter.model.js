const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parameterSchema = new Schema({
  name:           { type: String, required: true },
  unit:           { type: String, required: true },
  referenceMin:   Number,
  referenceMax:   Number
},{
  timestamps: true
});

module.exports = mongoose.model('Parameter', parameterSchema);
