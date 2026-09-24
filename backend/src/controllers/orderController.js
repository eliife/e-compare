const Order = require('../models/Order');
const Cart = require('../models/Cart');

// 1. SİPARİŞ OLUŞTUR (Sepetteki ürünlerle)
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { shippingAddress } = req.body;

    // Kullanıcının sepetini bul ve ürün detaylarını çek
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Sepetiniz boş, sipariş oluşturulamaz.' });
    }

    // Sipariş ürünlerini ve toplam tutarı hesapla
    let totalPrice = 0;
    const orderItems = cart.items.map((item) => {
      totalPrice += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price // Satın alım anındaki fiyatı sabitliyoruz
      };
    });

    // Yeni siparişi oluştur
    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      totalPrice
    });

    await order.save();

    // Sipariş başarıyla verildikten sonra sepeti boşalt
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: 'Sipariş başarıyla oluşturuldu!',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// 2. GİRİŞ YAPAN KULLANICININ KENDİ SİPARİŞLERİNİ GETİR
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ user: userId }).populate('orderItems.product');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};