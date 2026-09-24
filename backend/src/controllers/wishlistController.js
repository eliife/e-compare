const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// 1. KULLANICININ FAVORİLERİNİ GETİR
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    let wishlist = await Wishlist.findOne({ user: userId }).populate('products');

    if (!wishlist) {
      return res.status(200).json({ success: true, products: [], message: 'Favori listeniz boş.' });
    }

    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// 2. FAVORİLERE ÜRÜN EKLE VEYA ÇIKAR (Toggle Mantığı)
exports.toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      // Listesi hiç yoksa oluştur ve ürünü ekle
      wishlist = new Wishlist({
        user: userId,
        products: [productId]
      });
    } else {
      // Ürün zaten favorilerde var mı kontrol et
      const index = wishlist.products.indexOf(productId);

      if (index > -1) {
        // Varsa listeden çıkar (Unfavorite)
        wishlist.products.splice(index, 1);
      } else {
        // Yoksa listeye ekle (Favorite)
        wishlist.products.push(productId);
      }
    }

    await wishlist.save();
    await wishlist.populate('products');

    res.status(200).json({
      message: 'Favori listesi güncellendi!',
      wishlist
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};