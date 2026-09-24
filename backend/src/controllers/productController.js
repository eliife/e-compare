const Product = require('../models/Product');

// Türkçe karakter ve ek toleranslı arama yardımıcısı
const createTurkishRegex = (keyword) => {
  if (!keyword) return null;
  
  let clean = keyword.trim().toLowerCase();
  
  // Türkçe yaygın ekleri ve yumuşamaları köke indirgemek için temizlik
  // Örnek: kulaklık -> kulak, kulaklığı -> kulak
  clean = clean.replace(/(lık|lik|luk|lük|lar|ler|i|ı|ü|u)$/i, '');
  
  // Eğer kelimenin sonu k ile bitiyorsa, veritabanındaki ğ ihtimalini de kapsasın
  if (clean.endsWith('k')) {
    clean = clean.slice(0, -1) + '[kğ]';
  }

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return new RegExp(keyword, 'i');

  return new RegExp(words.join('|'), 'i');
};

// 1. TÜM ÜRÜNLERİ GETİR (Arama, Kategori, Marka, Fiyat, Sıralama ve Sayfalama ile)
exports.getProducts = async (req, res) => {
  try {
    const { keyword, category, brand, color, maxPrice, sort, page = 1, limit = 10 } = req.query;

    const query = {};

    if (keyword) {
      const searchRegex = createTurkishRegex(keyword);
      
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { brand: searchRegex }
      ];
    }

    if (category && category !== 'Tümü') {
      query.category = category;
    }

    if (brand) {
      const brandsArray = brand.split(',');
      query.brand = { $in: brandsArray };
    }

    if (color && color !== 'Tümü') {
      query.color = color;
    }

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    const skip = (Number(page) - 1) * Number(limit);
    let productsQuery = Product.find(query).skip(skip).limit(Number(limit));

    if (sort) {
      if (sort === 'price-asc') {
        productsQuery = productsQuery.sort({ price: 1 });
      } else if (sort === 'price-desc') {
        productsQuery = productsQuery.sort({ price: -1 });
      } else if (sort === 'newest') {
        productsQuery = productsQuery.sort({ createdAt: -1 });
      } else if (sort === 'bestseller') {
        productsQuery = productsQuery.sort({ salesCount: -1 });
      }
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }

    const products = await productsQuery;
    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      page: Number(page),
      pages: Math.ceil(totalProducts / Number(limit)),
      totalProducts,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("Hata Detayı:", error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// 2. YENİ GELEN ÜRÜNLERİ GETİR
exports.getNewArrivals = async (req, res) => {
  try {
    const { keyword, category, brand, color, maxPrice, sort, limit = 20 } = req.query;
    
    const query = {};

    if (keyword) {
      const searchRegex = createTurkishRegex(keyword);
      
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { brand: searchRegex }
      ];
    }

    if (category && category !== 'Tümü') {
      query.category = category;
    }

    if (brand) {
      const brandsArray = brand.split(',');
      query.brand = { $in: brandsArray };
    }

    if (color && color !== 'Tümü') {
      query.color = color;
    }

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    let sortCriteria = { createdAt: -1 };
    if (sort === 'price-asc') {
      sortCriteria = { price: 1 };
    } else if (sort === 'price-desc') {
      sortCriteria = { price: -1 };
    }

    const products = await Product.find(query).sort(sortCriteria).limit(Number(limit));
    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      totalProducts,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// 3. TEK BİR ÜRÜNÜ DETAYLI GETİR
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// 4. YENİ ÜRÜN EKLE (Sadece Admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, brand, color, image, rating, numReviews, salesCount } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      category,
      brand,
      color,
      image,
      rating: rating || 0,
      numReviews: numReviews || 0,
      salesCount: salesCount || 0
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla eklendi.',
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// 5. ÜRÜNÜ GÜNCELLE (Sadece Admin)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Ürün başarıyla güncellendi.',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// 6. ÜRÜNÜ SİL (Sadece Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Ürün başarıyla silindi.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};