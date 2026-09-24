'use client';

import { useState, useEffect } from 'react';
import API from '@/services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import Header from '@/components/header'; // Ortak Header bileşeni
import Footer from '@/components/footer'; // Ortak Footer bileşeni

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !user) {
      router.push('/login');
    }
  }, [isMounted, user, router]);

  useEffect(() => {
    if (isMounted && user) {
      fetchFavorites();
    }
  }, [isMounted, user]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      // Token'ın localStorage'dan güvenle okunup isteğe eklendiğinden emin oluyoruz
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const response = await API.get('/wishlist', config);
      const items = response.data.wishlist?.products || response.data.products || [];
      setFavorites(items);
    } catch (err) {
      console.error('Favoriler alınamadı:', err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const response = await API.post('/wishlist/toggle', { productId }, config);
      const updatedItems = response.data.wishlist?.products || [];
      setFavorites(updatedItems);
    } catch (err) {
      alert('Ürün favorilerden çıkarılamadı.');
    }
  };

  const filteredFavorites = favorites.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isMounted || !user) return null;

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-slate-900 selection:text-white flex flex-col justify-between">
      <div>
        {/* Ortak Header Bileşeni */}
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Sayfa İçeriği */}
        <main className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-8">
            <div>
              <h1 className="text-xl font-semibold tracking-wide text-slate-900 uppercase">Favori Ürünlerim</h1>
              <p className="text-xs text-slate-400 mt-1">Beğendiğiniz ürünleri burada saklayabilir ve sepetinize ekleyebilirsiniz.</p>
            </div>
            <span className="text-xs text-slate-400 font-medium">{filteredFavorites.length} ürün listeleniyor</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
          ) : filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredFavorites.map((product) => {
                const productId = product._id || product.id;

                // Multer / Harici görsel entegrasyonu
                const backendURL = 'http://localhost:5000';
                const rawImg = product.images?.[0] || product.image;
                const imageUrl = rawImg 
                  ? (rawImg.startsWith('http') ? rawImg : `${backendURL}${rawImg}`)
                  : null;

                return (
                  <div key={productId} className="group relative flex flex-col">
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center border border-slate-100">
                      <Link href={`/products/${productId}`} className="w-full h-full flex items-center justify-center">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <span className="text-xs font-medium text-slate-400 group-hover:scale-105 transition duration-300">
                            Ürün Görseli
                          </span>
                        )}
                      </Link>
                      
                      {/* Favoriden Çıkarma Butonu */}
                      <button
                        onClick={() => handleRemoveFromWishlist(productId)}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-white transition shadow-sm"
                        title="Favorilerden Çıkar"
                      >
                        <svg className="w-5 h-5 fill-red-500" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                    </div>

                    <div className="mt-4 flex justify-between items-start">
                      <div>
                        <Link href={`/products/${productId}`}>
                          <h3 className="text-sm font-medium text-slate-900 hover:underline">{product.name}</h3>
                        </Link>
                        <p className="mt-1 text-xs text-slate-500 line-clamp-1">{product.description}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{product.price} ₺</p>
                    </div>

                    <button
                      onClick={() => dispatch(addToCart(product))}
                      className="mt-3 w-full rounded border border-slate-200 bg-white py-2 text-xs font-medium text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition shadow-sm"
                    >
                      Sepete Ekle
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 space-y-4">
              <p className="text-sm text-slate-400">Favori listenizde ürün bulunamadı.</p>
              <Link href="/" className="inline-block rounded border border-slate-200 bg-slate-900 px-6 py-2.5 text-xs font-medium text-white hover:bg-slate-800 transition shadow-sm">
                Alışverişe Başla
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* Ortak Footer Bileşeni */}
      <Footer />
    </div>
  );
}