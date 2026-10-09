const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Blueprint: User Schema definition
const userSchema = new mongoose.Schema({
  // your schema definition here
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Blueprint: Password hashing middleware
userSchema.pre('save', async function (next) {
  // your code here
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Blueprint: Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  // your code here
  return await bcrypt.compare(candidatePassword, this.password);

};

module.exports = mongoose.model('User', userSchema);
