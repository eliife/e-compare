const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  color: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 }
}, { timestamps: true });

// 🔎 İŞTE BURASI: Arama performansını ve esnekliğini artıran Text Index
productSchema.index({ name: 'text', description: 'text', category: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);