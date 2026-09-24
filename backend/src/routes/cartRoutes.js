const express = require('express');
const { 
  getCart, 
  addToCart, 
  removeFromCart, 
  clearCart 
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Tüm sepet rotaları korumalıdır (Giriş yapılmış olmalı)
router.get('/', protect, getCart);                     // Sepeti görüntüle: GET /api/cart
router.post('/add', protect, addToCart);               // Sepete ürün ekle: POST /api/cart/add
router.delete('/item/:productId', protect, removeFromCart); // Sepetten ürün sil: DELETE /api/cart/item/:id
router.delete('/', protect, clearCart);                // Sepeti komple boşalt: DELETE /api/cart

module.exports = router;