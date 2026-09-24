const User = require('../models/User');

const admin = async (req, res, next) => {
  try {
    // req.user, authMiddleware (protect) sayesinde token'dan geliyor
    const user = await User.findById(req.user.userId);

    if (user && user.role === 'admin') {
      next(); // Kullanıcı admin ise devam et
    } else {
      res.status(403).json({ message: 'Erişim reddedildi. Bu işlem için Admin yetkisi gerekiyor.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

exports.admin = admin;