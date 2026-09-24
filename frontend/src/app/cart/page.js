'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, decreaseQuantity, removeFromCart, clearCart } from '@/store/cartSlice';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer'; // Ortak Footer bileşeni

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-slate-900 selection:text-white flex flex-col justify-between">
      <div>
        {/* Ortak Header Bileşeni */}
        <Header />

        {/* Ana İçerik */}
        <main className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-10">
            <div>
              <h1 className="text-xl font-semibold tracking-wide text-slate-900 uppercase">Alışveriş Sepeti</h1>
              <p className="text-xs text-slate-400 mt-1">Sepetinizdeki ürünleri inceleyebilir ve siparişinizi tamamlayabilirsiniz.</p>
            </div>
            <span className="text-xs text-slate-400 font-medium">{cartItems.length} çeşit ürün</span>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <p className="text-sm text-slate-400">Sepetinizde henüz ürün bulunmuyor.</p>
              <Link
                href="/"
                className="inline-block rounded border border-slate-200 bg-slate-900 px-6 py-2.5 text-xs font-medium text-white hover:bg-slate-800 transition shadow-sm"
              >
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Ürün Listesi */}
              <div className="lg:col-span-2 space-y-4">
                <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                  {cartItems.map((item) => {
                    const itemId = item._id || item.id;

                    // Ürün görselini yakalama ve backend URL entegrasyonu
                    const backendURL = 'http://localhost:5000';
                    const rawImg = item.images?.[0] || item.image;
                    const imageUrl = rawImg 
                      ? (rawImg.startsWith('http') ? rawImg : `${backendURL}${rawImg}`) 
                      : null;

                    return (
                      <div key={itemId} className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* Ürün Bilgisi */}
                        <div className="flex items-center space-x-4">
                          <div className="h-20 w-20 rounded-lg bg-slate-50 flex items-center justify-center text-xs text-slate-400 font-medium border border-slate-100 flex-shrink-0 overflow-hidden">
                            <Link href={`/products/${itemId}`} className="w-full h-full flex items-center justify-center">
                              {imageUrl ? (
                                <img 
                                  src={imageUrl} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover object-center"
                                />
                              ) : (
                                <span className="text-xs text-slate-400">Görsel</span>
                              )}
                            </Link>
                          </div>
                          <div>
                            <Link href={`/products/${itemId}`}>
                              <h3 className="text-sm font-medium text-slate-900 hover:underline">{item.name}</h3>
                            </Link>
                            <p className="text-xs text-slate-500 mt-1">{item.price} ₺</p>
                          </div>
                        </div>

                        {/* Adet ve Fiyat Kontrolleri */}
                        <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8">
                          {/* Adet Butonları */}
                          <div className="flex items-center border border-slate-200 rounded overflow-hidden bg-white shadow-sm">
                            <button
                              onClick={() => dispatch(decreaseQuantity(itemId))}
                              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 transition"
                            >
                              -
                            </button>
                            <span className="px-3 py-1.5 text-xs font-semibold text-slate-800 min-w-[2rem] text-center">{item.quantity}</span>
                            <button
                              onClick={() => dispatch(addToCart(item))}
                              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 transition"
                            >
                              +
                            </button>
                          </div>

                          {/* Toplam Fiyat */}
                          <span className="text-sm font-semibold text-slate-900 w-24 text-right">
                            {item.price * item.quantity} ₺
                          </span>

                          {/* Silme Butonu */}
                          <button
                            onClick={() => dispatch(removeFromCart(itemId))}
                            className="text-slate-400 hover:text-red-500 transition p-1"
                            title="Ürünü Kaldır"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="text-xs text-red-500 hover:text-red-700 transition font-medium flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Sepeti Temizle
                  </button>
                  <Link href="/" className="text-xs text-slate-600 hover:text-slate-900 font-medium underline transition">
                    Alışverişe Devam Et
                  </Link>
                </div>
              </div>

              {/* Sipariş Özeti Kartı */}
              <div className="bg-slate-50/70 p-6 rounded-lg border border-slate-100 space-y-6">
                <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-widest border-b border-slate-200/60 pb-3">Sipariş Özeti</h2>
                
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Ürünler Toplamı</span>
                    <span className="font-medium text-slate-900">{totalPrice} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kargo</span>
                    <span className="font-medium text-slate-900">Ücretsiz</span>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 pt-4 flex justify-between text-sm font-semibold text-slate-900">
                  <span>Toplam Tutar</span>
                  <span>{totalPrice} ₺</span>
                </div>

                <button className="w-full rounded bg-slate-900 py-3 text-xs font-medium text-white hover:bg-slate-800 transition shadow-sm">
                  Alışverişi Tamamla
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}