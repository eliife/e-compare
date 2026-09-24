const express = require('express');
const { 
  register, 
  login, 
  getProfile, 
  updateProfile 
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Korumalı Profil Rotaları (Giriş yapılmış olmalı)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;