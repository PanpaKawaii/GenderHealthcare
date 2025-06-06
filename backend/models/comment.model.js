const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content:      { type: String, required: true },
  reply:        String,
  status:       { type: String, enum: ['Visible', 'Hidden', 'Reported'], default: 'Visible' },
  createDate:   { type: Date, default: Date.now },
  accountId:    { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  questionId:   { type: Schema.Types.ObjectId, ref: 'Question', required: true }
},{
  timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);
