const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true, // Örn: "Ev", "İş"
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  addressLine: {
    type: String,
    required: true, // Açık adres (Cadde, sokak, kapı no)
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false // Varsayılan adres mi?
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Address', addressSchema);