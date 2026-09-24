const express = require('express');
const upload = require('../middlewares/uploadMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');

const router = express.Router();

// Sadece Admin yetkisine sahip kullanıcılar görsel yükleyebilir
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Lütfen bir görsel seçin.' });
    }

    // Yüklenen dosyanın URL yolunu oluşturuyoruz (Örn: http://localhost:5000/uploads/image-123456.png)
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Görsel başarıyla yüklendi!',
      imageUrl: imageUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;