const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lütfen bir isim girin']
  },
  email: {
    type: String,
    required: [true, 'Lütfen bir e-posta adresi girin'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Lütfen bir şifre girin'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Şifre Sıfırlama Alanları
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);