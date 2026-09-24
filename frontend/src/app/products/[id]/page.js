'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import API from '@/services/api';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsMounted(true);

    const fetchProductDetail = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        const prodData = response.data.product || response.data;
        setProduct(prodData);

        // Eğer kullanıcı giriş yapmışsa favori durumunu kontrol et
        if (user) {
          try {
            const wishResponse = await API.get('/wishlist');
            const items = wishResponse.data.wishlist?.products || wishResponse.data.products || [];
            const exists = items.some((item) => (item._id || item.id) === (prodData._id || prodData.id));
            setIsFavorite(exists);
          } catch (err) {
            console.error('Favori durumu alınamadı:', err);
          }
        }

        setLoading(false);
      } catch (err) {
        setError('Ürün detayları yüklenirken bir sorun oluştu.');
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id, user]);

  const handleToggleWishlist = async () => {
    if (!user) {
      alert('Favorilere eklemek için lütfen giriş yapın.');
      return;
    }
    try {
      const productId = product._id || product.id;
      const response = await API.post('/wishlist/toggle', { productId });
      const items = response.data.wishlist?.products || [];
      const exists = items.some((item) => (item._id || item.id) === productId);
      setIsFavorite(exists);
    } catch (err) {
      alert('Favori işlemi gerçekleştirilemedi.');
    }
  };

  if (!isMounted) {
    return null;
  }

  // Multer / Harici görsel URL entegrasyonu
  const backendURL = 'http://localhost:5000';
  const rawImg = product?.images?.[0] || product?.image;
  const imageUrl = rawImg 
    ? (rawImg.startsWith('http') ? rawImg : `${backendURL}${rawImg}`)
    : null;

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-slate-900 selection:text-white flex flex-col justify-between">
      <div>
        {/* Ortak Header Bileşeni */}
        <Header />

        {/* Ana İçerik */}
        <main className="mx-auto max-w-7xl px-6 py-16">
          {loading && (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-900 border-t-transparent"></div>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-100 p-6 text-center text-xs text-red-600 font-medium max-w-md mx-auto">
              {error}
            </div>
          )}

          {!loading && !error && product && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Ürün Görseli Alanı */}
              <div className="lg:col-span-7">
                <div className="sticky top-28 aspect-square w-full overflow-hidden rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm group relative">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <span className="text-sm font-medium text-slate-400 group-hover:scale-105 transition duration-500">
                      Ürün Görseli
                    </span>
                  )}
                  
                  {/* Favori Butonu */}
                  <button
                    onClick={handleToggleWishlist}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:bg-white hover:text-red-500 transition shadow-sm"
                    title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                  >
                    <svg
                      className={`w-5 h-5 transition ${isFavorite ? 'fill-red-500 text-red-500' : 'fill-none stroke-current stroke-2'}`}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Ürün Bilgileri ve Aksiyonlar */}
              <div className="lg:col-span-5 space-y-8 lg:py-2">
                <div className="space-y-3">
                  <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-slate-400 bg-slate-100 px-2.5 py-1 rounded">
                    Yeni Sezon / Detay
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 leading-snug">
                    {product.name}
                  </h1>
                  <p className="text-2xl font-bold text-slate-900 pt-1">
                    {product.price} <span className="text-lg font-normal text-slate-500">₺</span>
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ürün Açıklaması</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {product.description || 'Bu ürün için henüz detaylı bir açıklama girilmemiş. Kalite standartlarına uygun olarak üretilmiştir.'}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-8 space-y-4">
                  <button
                    onClick={() => dispatch(addToCart(product))}
                    className="w-full rounded-xl bg-slate-900 py-4 text-xs font-semibold tracking-wide text-white hover:bg-slate-800 active:scale-[0.99] transition shadow-md shadow-slate-900/10"
                  >
                    Sepete Ekle
                  </button>

                  <div className="flex items-center justify-center gap-6 pt-4 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-9m18-11.25h-3.375c-.621 0-1.125.504-1.125 1.125v7.5m0-8.625l-3.375-3.375m3.375 3.375h-9.375"></path></svg>
                      Ücretsiz Kargo
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"></path></svg>
                      Güvenli Alışveriş
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Ortak Footer Bileşeni */}
      <Footer />
    </div>
  );
}