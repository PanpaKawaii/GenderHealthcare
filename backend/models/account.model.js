const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  name:      { type: String, required: true },
  image:     String,
  gender:    { type: String, enum: ['Male', 'Female', 'Other'] },
  email:     { type: String, required: true},
  phone:     String,
  password:  { type: String, required: true },
  role:      { type: String, enum: ['Customer', 'Counselor', 'Staff', 'Manager', 'Admin'], required: true },
  isVerified: { type: Boolean, default: false }
 
},
{
  timestamps: true
});

//pre save là hàm sẽ chạy trước khi lưu data vào DB
accountSchema.pre('save', function (next) {
  if (this.role === 'Counselor') {
    this.isVerified = true;
  }
  next();
});

module.exports = mongoose.model('Account', accountSchema);
