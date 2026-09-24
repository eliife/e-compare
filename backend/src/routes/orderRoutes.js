const express = require('express');
const { createOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Tüm sipariş rotaları korumalıdır (Giriş yapılmış olmalı)
router.post('/', protect, createOrder);          // Yeni sipariş ver: POST /api/orders
router.get('/myorders', protect, getMyOrders);   // Geçmiş siparişlerimi getir: GET /api/orders/myorders

module.exports = router;