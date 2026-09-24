const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // 1. İstek başlığında (headers) "Authorization" var mı ve "Bearer" ile mi başlıyor kontrol et
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // "Bearer <token>" formatından sadece token kısmını ayırıp alıyoruz
      token = req.headers.authorization.split(' ')[1];

      // 2. Token'ı çöz ve geçerli mi diye doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Token'ın içindeki kullanıcı bilgilerini req nesnesine ekle (Böylece sonraki fonksiyonda kimin istek attığını bileceğiz)
      req.user = decoded;

      // 4. Görev tamam, artık asıl controller fonksiyonuna geçebilirsin diyoruz
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Yetkisiz erişim, geçersiz token!' });
    }
  }

  // Eğer hiç token gönderilmemişse
  if (!token) {
    return res.status(401).json({ message: 'Yetkisiz erişim, token bulunamadı!' });
  }
};

module.exports = { protect };