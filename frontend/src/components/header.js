'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';

export default function Header({ searchTerm = '', setSearchTerm = () => {} }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const cartItems = useSelector((state) => state.cart.items);
  const totalItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setIsMounted(true);

    // Menü açıkken dışarıya tıklandığında menüyü kapatmak için event listener
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Arama formu gönderildiğinde (Enter'a basıldığında) çalışacak fonksiyon
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        
        {/* Sol Kısım: Logo ve Arama Çubuğu */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900 lowercase">
            e-<span className="text-slate-600 font-normal">compare</span>
          </Link>

          {/* Arama Çubuğu (Form olarak güncellendi) */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center bg-[#f4f0eb] rounded-full px-5 py-3 w-72 md:w-80 border border-transparent focus-within:border-slate-300 transition">
            <button type="submit" className="flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 hover:text-slate-600 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ürün ara..."
              className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </form>
        </div>

        {/* Orta Menü Linkleri (Masaüstü için) */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <Link href="/products" className="hover:text-slate-950 transition">Tüm Ürünler</Link>
          <Link href="/bestsellers" className="hover:text-slate-950 transition">Çok Satanlar</Link>
          <Link href="/new-arrivals" className="hover:text-slate-950 transition">Yeni Gelenler</Link>
          <Link href="/campaigns" className="hover:text-slate-950 transition">Kampanyalar</Link>
          <Link href="/blog" className="hover:text-slate-950 transition">Blog</Link>
        </nav>

        {/* Sağ Kısım: Butonlar */}
        <div className="flex items-center space-x-4">
          
         {/* Favoriler Butonu */}
        <Link href="/favorites" className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:border-slate-400 transition bg-white" title="Favorilerim">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </Link>

          {/* Profil / Giriş Butonu */}
          {isMounted && user ? (
            <Link href="/profile" className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:border-slate-400 transition bg-white" title="Profilim">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </Link>
          ) : (
            <Link href="/login" className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:border-slate-400 transition bg-white" title="Giriş Yap">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </Link>
          )}

          {/* Sepet Butonu */}
          <Link href="/cart" className="relative w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:border-slate-400 transition bg-white" title="Sepetim">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            {isMounted && totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#4a5542] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {totalItemsCount}
              </span>
            )}
          </Link>

          {/* Mobil Menü Butonu (Üç Nokta - lg ekran altında görünür) */}
          <div className="relative lg:hidden" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:border-slate-400 transition bg-white"
              title="Menü"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="6" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="18" r="1.5" />
              </svg>
            </button>

            {/* Açılır (Dropdown) Menü */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 flex flex-col space-y-1 text-sm font-medium text-slate-700">
                <Link
                  href="/products"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-5 py-2.5 hover:bg-slate-50 hover:text-slate-950 transition"
                >
                  Tüm Ürünler
                </Link>
                <Link
                  href="/bestsellers"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-5 py-2.5 hover:bg-slate-50 hover:text-slate-950 transition"
                >
                  Çok Satanlar
                </Link>
                <Link
                  href="/new-arrivals"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-5 py-2.5 hover:bg-slate-50 hover:text-slate-950 transition"
                >
                  Yeni Gelenler
                </Link>
                <Link
                  href="/campaigns"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-5 py-2.5 hover:bg-slate-50 hover:text-slate-950 transition"
                >
                  Kampanyalar
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-5 py-2.5 hover:bg-slate-50 hover:text-slate-950 transition"
                >
                  Blog
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}