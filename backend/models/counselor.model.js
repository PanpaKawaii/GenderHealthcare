const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counselorSchema = new Schema({
  accountId:   { type: Schema.Types.ObjectId, ref: 'Account', unique: true, required: true },
  degree:      String,
  experience:  Number,
  bio:         String
},{
  timestamps: true
});

module.exports = mongoose.model('Counselor', counselorSchema);
