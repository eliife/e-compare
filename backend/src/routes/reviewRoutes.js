const express = require('express');
const { createProductReview, getProductReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/:productId', getProductReviews);          // Ürünün yorumlarını getir: GET /api/reviews/:productId
router.post('/:productId', protect, createProductReview); // Ürüne yorum yap: POST /api/reviews/:productId

module.exports = router;