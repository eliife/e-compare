const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet'); // Güvenlik başlıkları için
const rateLimit = require('express-rate-limit'); // Aşırı istek koruması için
const connectDB = require('./config/db');

// Rotaları içeri aktarıyoruz
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const addressRoutes = require('./routes/addressRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Veritabanına bağlan
connectDB();

// 1. GÜVENLİK VE PERFORMANS MIDDLEWARE'LERİ
app.use(helmet()); // HTTP güvenlik başlıklarını ayarlar

// Rate Limiter: Aynı IP'den 15 dakika içinde en fazla 100 istek atılabilmesini sağlar
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Maksimum 100 istek
  message: {
    success: false,
    message: 'Çok fazla istek gönderildi, lütfen bir süre sonra tekrar deneyin.'
  }
});
app.use('/api/', limiter); // Sadece /api rotalarında bu kural geçerli olsun

// Middleware'ler (CORS güncellendi)
app.use(cors({
  origin: 'http://localhost:3000', // Frontend adresine izin veriliyor
  credentials: true,               // Token ve çerez alışverişine izin verilir
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Yüklenen resimlerin dışarıdan erişilebilir olması için static klasör tanımı
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotaların Tanımlanması
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/upload', uploadRoutes);

// Test Rotası
app.get('/', (req, res) => {
  res.json({ message: 'E-Ticaret Backend API çalışıyor! 🚀' });
});

module.exports = app;