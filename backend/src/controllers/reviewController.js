const Review = require('../models/Review');
const Product = require('../models/Product');

// 1. ÜRÜNE YORUM EKLE VEYA GÜNCELLE
exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;
    const userId = req.user.userId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    // Daha önce yorum yapmış mı kontrol et
    let review = await Review.findOne({ product: productId, user: userId });

    if (review) {
      // Varsa güncele
      review.rating = Number(rating);
      review.comment = comment;
      await review.save();
    } else {
      // Yoksa yeni oluştur
      review = new Review({
        user: userId,
        product: productId,
        rating: Number(rating),
        comment
      });
      await review.save();
    }

    // Ürünün ortalama puanını (rating) ve toplam yorum sayısını yeniden hesapla
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();

    res.status(201).json({
      message: 'Yorumunuz başarıyla eklendi!',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// 2. BİR ÜRÜNÜN TÜM YORUMLARINI GETİR
exports.getProductReviews = async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviews = await Review.find({ product: productId }).populate('user', 'name');

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};