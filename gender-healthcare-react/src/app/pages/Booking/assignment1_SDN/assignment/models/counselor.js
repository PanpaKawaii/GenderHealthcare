const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counselorSchema = new Schema({
  accountId: { type: Schema.Types.ObjectId, ref: 'Account', unique: true, required: true },
  degree: { type: String, required: true },
  experience: { type: Number, required: true, default: 0 },
  bio: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Counselor', counselorSchema);
