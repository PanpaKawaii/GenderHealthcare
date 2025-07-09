const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const accountSchema = new Schema({
  name:      { type: String, required: true },
  image:     String,
  gender:    { type: String, enum: ['Male', 'Female', 'Other'] },
  email:     { type: String, required: true, unique: true },
  phone:     String,
  password:  { type: String, required: true },
  role:      { type: String, enum: ['Customer', 'Counselor', 'Doctor', 'Manager', 'Admin'], required: true },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
},
{
  timestamps: true
});

//pre save là hàm sẽ chạy trước khi lưu data vào DB
accountSchema.pre('save', async function (next) {
  if (this.role === 'Counselor') {
    this.isVerified = true;
  }
  
  // Only hash password if it's modified or new
  if (this.isModified('password') || this.isNew) {
    try {
      // Generate salt with 10 rounds
      const salt = await bcrypt.genSalt(10);
      // Hash password with generated salt
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Method to compare password
accountSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Account', accountSchema);
