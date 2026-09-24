const Cart = require('../models/Cart');
const Product = require('../models/Product');

// 1. KULLANICININ SEPETİNİ GETİR
exports.getCart = async (req, res) => {
  try {
    // Giriş yapan kullanıcının ID'sini req.user'dan alıyoruz (Middleware sayesinde geliyor)
    const userId = req.user.userId;

    let cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(200).json({ success: true, items: [], message: 'Sepetiniz boş.' });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// 2. SEPETE ÜRÜN EKLE VEYA MİKTARINI ARTIR
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    // Ürünün veritabanında gerçekten var olup olmadığını kontrol et
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    // Kullanıcının daha önce bir sepeti var mı bak
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Eğer sepeti hiç yoksa, yeni sepet oluştur ve bu ürünü ekle
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      // Sepeti varsa, eklenmek istenen ürün bu sepette daha önce var mı kontrol et
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Ürün zaten sepette var, sadece miktarını (quantity) artır
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        // Ürün sepette yok, yeni ürün olarak diziye ekle
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    
    // Sepeti populate ederek (ürün detaylarıyla birlikte) geri döndürelim
    await cart.populate('items.product');

    res.status(200).json({
      message: 'Ürün sepete eklendi!',
      cart
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// 3. SEPETTEN TEK BİR ÜRÜNÜ ÇIKAR
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.productId;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Sepet bulunamadı.' });
    }

    // Silinmek istenen ürün dışındaki diğer ürünleri filtreleyerek listede tutuyoruz
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      message: 'Ürün sepetten çıkarıldı!',
      cart
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// 4. SEPETİ TAMAMEN BOŞALT
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Sepet bulunamadı.' });
    }

    // Items dizisini tamamen boşaltıyoruz
    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: 'Sepet tamamen boşaltıldı!',
      cart
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};