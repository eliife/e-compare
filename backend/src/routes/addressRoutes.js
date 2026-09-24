const express = require('express');
const { getUserAddresses, addAddress, deleteAddress,updateAddress } = require('../controllers/addressController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Tüm adres işlemleri giriş (token) gerektirir, bu yüzden 'protect' middleware kullanıyoruz
router.get('/', protect, getUserAddresses);       // Kullanıcının adreslerini listele
router.post('/', protect, addAddress);            // Yeni adres ekle
router.delete('/:id', protect, deleteAddress);    // Adresi sil
router.put('/:id', protect, updateAddress);

module.exports = router;