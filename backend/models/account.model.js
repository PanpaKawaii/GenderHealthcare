const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  name:      { type: String, required: true },
  image:     String,
  gender:    { type: String, enum: ['Male', 'Female', 'Other'] },
  email:     { type: String, required: true, unique: true },
  phone:     String,
  password:  { type: String, required: true },
  role:      { type: String, enum: ['Customer', 'Counselor', 'Staff', 'Manager', 'Admin'], required: true },
 
},
{
  timestamps: true
});

module.exports = mongoose.model('Account', accountSchema);
