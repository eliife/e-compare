'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-zinc-400 text-xs py-16 px-6 border-t border-zinc-800/80 mt-20">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Üst Kısım: Ürünler ve Keşif Linkleri (Yatay / Minimalist Düzende) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-zinc-800/80 pb-10">
          
          {/* Marka İsmi / Logo Alanı */}
          <div>
            <span className="text-white text-base font-semibold tracking-tight">e-compare</span>
            <p className="text-zinc-500 text-xs mt-1">Geleceğin teknolojisi ve en iyi fiyatlar.</p>
          </div>

          {/* Hızlı Erişim Linkleri */}
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-normal text-zinc-300">
            <li><Link href="/products" className="hover:text-white transition">Tüm Ürünler</Link></li>
            <li><Link href="/bestsellers" className="hover:text-white transition">Çok Satanlar</Link></li>
            <li><Link href="/new-arrivals" className="hover:text-white transition">Yeni Gelenler</Link></li>
            <li><Link href="/campaigns" className="hover:text-white transition">Kampanyalar</Link></li>
            <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
          </ul>

        </div>

        {/* Alt Kısım: Telif Hakkı ve Sosyal Medya İkonları */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
          
          {/* Telif Metni */}
          <p className="text-zinc-500 text-xs">
            Copyright © 2026 e-compare. Tüm hakları saklıdır.
          </p>

          {/* Sosyal Medya İkonları (SVG) */}
          <div className="flex items-center space-x-5 text-zinc-400">
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" aria-label="Instagram">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>

            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" aria-label="Facebook">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>

            {/* Twitter / X */}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" aria-label="Twitter">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}