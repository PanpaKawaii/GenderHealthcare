const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  counselorId: { type: Schema.Types.ObjectId, ref: 'Counselor', required: true },
  title: { type: String, required: true },
  content: String,
  image: String,
  author: String,
  category: String,
  status:{type: String, enum: ['deleted', 'active'], default: 'active'},
  postedDate: { type: Date,  },
  lastEdited: { type: Date, }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
