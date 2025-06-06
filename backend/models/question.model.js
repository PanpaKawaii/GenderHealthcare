const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  content:     { type: String, required: true },
  type:        String,
  status:      { type: String, enum: ['Pending', 'Answered', 'Closed'], default: 'Pending' },
  createDate:  { type: Date, default: Date.now },
  accountId:   { type: Schema.Types.ObjectId, ref: 'Account', required: true }
},{
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);
