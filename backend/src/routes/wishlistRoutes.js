const express = require('express');
const { getWishlist, toggleWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getWishlist);          // Favorileri getir: GET /api/wishlist
router.post('/toggle', protect, toggleWishlist); // Favoriye ekle/çıkar: POST /api/wishlist/toggle

module.exports = router;