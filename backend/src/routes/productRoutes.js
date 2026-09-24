const express = require('express');
const { 
  getProducts, 
  getNewArrivals, // Yeni fonksiyonu buraya ekleyeceğiz
  getProductById, 
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');

const router = express.Router();

// 1. ÖZEL VE SABİT ROTALAR (DİNAMİK :id'den ÖNCE YAZILMALIDIR)
router.get('/new-arrivals', getNewArrivals); // GET /api/products/new-arrivals

// 2. GENEL VE DİNAMİK ROTALAR
router.get('/', getProducts);         
router.get('/:id', getProductById);    

// 3. KORUMALI VE YETKİLİ ROTALAR
router.post('/', protect, admin, createProduct);       
router.put('/:id', protect, admin, updateProduct);    
router.delete('/:id', protect, admin, deleteProduct); 

module.exports = router;