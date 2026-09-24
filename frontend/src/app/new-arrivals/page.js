'use client';

import { useState, useEffect } from 'react';
import API from '@/services/api';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function NewArrivalsPage() {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Filtreleme State'leri (iPhone gibi yüksek fiyatlı ürünlerin gizlenmemesi için maxPrice 100.000 yapıldı)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColor, setSelectedColor] = useState('Tümü');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Akordeon State'leri (Sol Menü)
  const [openSections, setOpenSections] = useState({
    category: true,
    brand: true,
    color: true,
    price: true,
    rating: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // 1. Backend'den Filtrelenmiş Ürünleri Çeken useEffect
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams();

        params.append('sort', sortBy || 'newest');

        if (searchTerm) {
          params.append('keyword', searchTerm);
        }

        if (selectedCategory && selectedCategory !== 'Tümü') {
          params.append('category', selectedCategory);
        }

        if (selectedBrands.length > 0) {
          params.append('brand', selectedBrands.join(','));
        }

        if (selectedColor && selectedColor !== 'Tümü') {
          params.append('color', selectedColor);
        }

        if (minRating > 0) {
          params.append('minRating', minRating);
        }

        if (maxPrice) {
          params.append('maxPrice', maxPrice);
        }

        if (inStockOnly) {
          params.append('inStock', 'true');
        }

        if (onSaleOnly) {
          params.append('onSale', 'true');
        }

        const productRes = await API.get(`/products?${params.toString()}`);
        
        const fetchedProducts = productRes.data.products || productRes.data;
        setProducts(fetchedProducts);
        setTotalProductsCount(productRes.data.totalProducts ?? fetchedProducts.length);

        setLoading(false);
      } catch (err) {
        setError('Yeni gelen ürünler yüklenirken bir sorun oluştu.');
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, [searchTerm, selectedCategory, selectedBrands, selectedColor, minRating, maxPrice, inStockOnly, onSaleOnly, sortBy]);

  // 2. Kullanıcı Giriş Yaptığında Favorileri Çekme
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const wishlistRes = await API.get('/wishlist');
          const items = wishlistRes.data.wishlist?.products || wishlistRes.data.products || [];
          setWishlistIds(items.map(item => item._id || item));
        } catch (err) {
          console.warn('Favoriler getirilemedi:', err.message);
        }
      }
    };

    fetchWishlist();
  }, [user]);

  const handleToggleWishlist = async (productId) => {
    if (!user) {
      alert('Favorilere ürün eklemek için giriş yapmalısınız.');
      return;
    }

    try {
      const response = await API.post('/wishlist/toggle', { productId });
      const updatedProducts = response.data.wishlist?.products || [];
      setWishlistIds(updatedProducts.map(item => item._id || item));
    } catch (err) {
      alert('Favori güncellenemedi.');
    }
  };

  const categories = [
    'Telefon Aksesuar',
    'Giyilebilir Teknoloji',
    'Kulaklık',
    'Cep Telefonu',
    'Masaüstü ve Telsiz Telefon'
  ];

  const brands = [
    'Apple',
    'Samsung',
    'Xiaomi',
    'Anker',
    'Lenovo',
    'Sony',
    'Asus',
    'JBL'
  ];
  
  const colors = [
    { name: 'Siyah', hex: 'bg-slate-900' },
    { name: 'Uzay Grisi', hex: 'bg-zinc-700' },
    { name: 'Gümüş', hex: 'bg-slate-300' },
    { name: 'Beyaz', hex: 'bg-white border border-slate-300' },
    { name: 'Mavi', hex: 'bg-blue-600' },
    { name: 'Gece Yarısı', hex: 'bg-slate-950' },
    { name: 'Altın', hex: 'bg-amber-300' },
    { name: 'Rose Gold', hex: 'bg-rose-300' },
    { name: 'Kırmızı', hex: 'bg-red-600' },
    { name: 'Yeşil', hex: 'bg-emerald-600' }
  ];

  const handleBrandCheckbox = (brandName) => {
    if (selectedBrands.includes(brandName)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brandName));
    } else {
      setSelectedBrands([...selectedBrands, brandName]);
    }
  };

  // Ortak Filtre İçeriği (Masaüstü Sidebar ve Mobil Drawer için)
  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-3.5 border-b border-slate-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
          Filtre Seçenekleri
        </h3>
        <button
          onClick={() => {
            setSelectedCategory('Tümü');
            setSelectedBrands([]);
            setSelectedColor('Tümü');
            setMinRating(0);
            setMaxPrice(100000);
            setInStockOnly(false);
            setOnSaleOnly(false);
            setSearchTerm('');
            setSortBy('newest');
          }}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition underline"
        >
          Temizle
        </button>
      </div>

      {/* 1. KATEGORİLER */}
      <div className="border-b border-slate-100 pb-4">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex justify-between items-center text-sm font-bold text-slate-900 py-1.5 hover:text-blue-600 transition"
        >
          <span>Alt Kategoriler</span>
          <span className="text-slate-400 font-normal text-base">{openSections.category ? '−' : '+'}</span>
        </button>
        {openSections.category && (
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer select-none text-sm text-slate-700 hover:text-slate-900 font-medium">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === 'Tümü'}
                onChange={() => setSelectedCategory('Tümü')}
                className="w-4 h-4 text-slate-900 focus:ring-slate-900 accent-slate-900 cursor-pointer"
              />
              <span>Tümü</span>
            </label>
            {categories.map((categoryName) => (
              <label key={categoryName} className="flex items-center gap-3 cursor-pointer select-none text-sm text-slate-700 hover:text-slate-900 font-medium">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === categoryName}
                  onChange={() => setSelectedCategory(categoryName)}
                  className="w-4 h-4 text-slate-900 focus:ring-slate-900 accent-slate-900 cursor-pointer"
                />
                <span>{categoryName}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 2. MARKA */}
      <div className="border-b border-slate-100 pb-4">
        <button
          onClick={() => toggleSection('brand')}
          className="w-full flex justify-between items-center text-sm font-bold text-slate-900 py-1.5 hover:text-blue-600 transition"
        >
          <span>Marka</span>
          <span className="text-slate-400 font-normal text-base">{openSections.brand ? '−' : '+'}</span>
        </button>
        {openSections.brand && (
          <div className="mt-3 space-y-3 max-h-56 overflow-y-auto pr-1">
            {brands.map((brandName) => (
              <label key={brandName} className="flex items-center gap-3 cursor-pointer select-none text-sm text-slate-700 hover:text-slate-900 font-medium">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brandName)}
                  onChange={() => handleBrandCheckbox(brandName)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 accent-slate-900 cursor-pointer"
                />
                <span>{brandName}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 3. RENK SEÇENEKLERİ */}
      <div className="border-b border-slate-100 pb-4">
        <button
          onClick={() => toggleSection('color')}
          className="w-full flex justify-between items-center text-sm font-bold text-slate-900 py-1.5 hover:text-blue-600 transition"
        >
          <span>Renk Seçenekleri</span>
          <span className="text-slate-400 font-normal text-base">{openSections.color ? '−' : '+'}</span>
        </button>
        {openSections.color && (
          <div className="mt-3 flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
            <button
              onClick={() => setSelectedColor('Tümü')}
              className={`px-3 py-1.5 rounded-lg text-xs border transition font-semibold ${
                selectedColor === 'Tümü'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              Tümü
            </button>
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                title={color.name}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border transition font-medium ${
                  selectedColor === color.name
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${color.hex}`}></span>
                {color.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. FİYAT ARALIĞI */}
      <div className="pb-2">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex justify-between items-center text-sm font-bold text-slate-900 py-1.5 hover:text-blue-600 transition"
        >
          <span>Fiyat Aralığı</span>
          <span className="text-slate-400 font-normal text-base">{openSections.price ? '−' : '+'}</span>
        </button>
        {openSections.price && (
          <div className="mt-3 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Maksimum</span>
              <span className="font-bold text-slate-900 text-sm">{maxPrice.toLocaleString()} ₺</span>
            </div>
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-slate-900 selection:text-white flex flex-col justify-between">
      <div>
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
          {/* Üst Başlık, Mobil Filtre Butonu ve Sıralama Alanı */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 mb-6 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 uppercase">Yeni Gelenler</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">En yeni eklenen {totalProductsCount} ürün listeleniyor</p>
              </div>

              {/* Mobil Filtre Açma Butonu */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl text-xs font-semibold transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.172a1 1 0 01-1.447.894l-4-2A1 1 0 017 18v-3.172a1 1 0 00-.293-.707L.293 7.293A1 1 0 010 6.586V4z" />
                </svg>
                Filtrele
              </button>
            </div>

            {/* Sıralama Seçeneği */}
            <div className="flex items-center gap-3 justify-between md:justify-end">
              <span className="text-xs sm:text-sm text-slate-600 font-medium">Sırala:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-slate-400 transition"
              >
                <option value="newest">En Yeni (Varsayılan)</option>
                <option value="price-asc">Fiyata Göre Artan</option>
                <option value="price-desc">Fiyata Göre Azalan</option>
              </select>
            </div>
          </div>

          {/* Ana İçerik Grid: Sol Filtre Paneli + Sağ Ürün Listesi */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            
            {/* MASAÜSTÜ SOL FİLTRELEME ALANI (Sidebar) */}
            <aside className="hidden lg:block lg:col-span-1.5 xl:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 sticky top-28 shadow-sm">
              <FilterContent />
            </aside>

            {/* MOBİL FİLTRE MODALI (Drawer) */}
            {isMobileFilterOpen && (
              <div className="fixed inset-0 z-50 flex lg:hidden">
                {/* Arka plan karartma */}
                <div 
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setIsMobileFilterOpen(false)}
                />
                {/* Kaydırmalı Panel */}
                <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-10">
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                      <h2 className="text-base font-bold text-slate-900 uppercase">Filtreler</h2>
                      <button 
                        onClick={() => setIsMobileFilterOpen(false)}
                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
                      >
                        ✕
                      </button>
                    </div>
                    <FilterContent />
                  </div>
                  <div className="pt-4 border-t border-slate-200 mt-4">
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-slate-800 transition"
                    >
                      Sonuçları Göster
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SAĞ ÜRÜN LİSTESİ */}
            <div className="w-full lg:col-span-4">
              {loading && (
                <div className="flex justify-center items-center py-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                </div>
              )}

              {error && (
                <div className="rounded-md bg-red-50 p-4 text-center text-sm text-red-600 font-medium">{error}</div>
              )}

              {!loading && !error && products.length === 0 && (
                <div className="text-center py-24 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 text-sm sm:text-base font-medium">
                  Yeni gelen ürünler arasında aradığınız kriterlere uygun ürün bulunamadı.
                </div>
              )}

              <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
                {products.map((product) => {
                  const productId = product._id || product.id;
                  const isFavorited = wishlistIds.includes(productId);

                  // Ürün görselini yakalama ve backend URL entegrasyonu
                  const backendURL = 'http://localhost:5000';
                  const rawImg = product.images?.[0] || product.image;
                  const imageUrl = rawImg 
                    ? (rawImg.startsWith('http') ? rawImg : `${backendURL}${rawImg}`) 
                    : null;

                  return (
                    <div key={productId} className="group relative flex flex-col bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition duration-300">
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Link href={`/products/${productId}`} className="w-full h-full flex items-center justify-center">
                          {imageUrl ? (
                            <img 
                              src={imageUrl} 
                              alt={product.name} 
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                            />
                          ) : (
                            <span className="text-xs font-medium text-slate-400 group-hover:scale-105 transition duration-300">
                              Ürün Görseli
                            </span>
                          )}
                        </Link>
                        {/* Kalp Favori Butonu */}
                        <button
                          onClick={() => handleToggleWishlist(productId)}
                          className="absolute top-2.5 right-2.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:bg-white transition shadow-sm z-10"
                        >
                          <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorited ? 'text-red-500 fill-red-500' : 'text-slate-500'}`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                          </svg>
                        </button>
                      </div>

                      <div className="mt-3 sm:mt-4 flex justify-between items-start">
                        <div>
                          <Link href={`/products/${productId}`}>
                            <h3 className="text-xs sm:text-sm font-medium text-slate-900 hover:underline line-clamp-1">{product.name}</h3>
                          </Link>
                          <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-slate-500 line-clamp-1">{product.description}</p>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 whitespace-nowrap ml-2">{product.price} ₺</p>
                      </div>

                      <button
                        onClick={() => dispatch(addToCart(product))}
                        className="mt-3 sm:mt-4 w-full rounded-xl bg-slate-900 py-2 sm:py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-sm"
                      >
                        Sepete Ekle
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}