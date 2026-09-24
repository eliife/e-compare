'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/header'; // Projendeki Header yolu
import Footer from '@/components/footer'; // Projendeki Footer yolu (Eğer dosya adın farklıysa burayı güncelleyebilirsin)

export default function CampaignsPage() {
  // Arama state'i (Header prop gereksinimleri için)
  const [searchTerm, setSearchTerm] = useState('');
  
  // Örnek kampanya kategorileri filtresi için state
  const [activeTab, setActiveTab] = useState('tumu');

  // Örnek kampanya verileri
  const campaigns = [
    {
      id: 1,
      title: 'Büyük Teknoloji Festivali',
      description: 'Seçili kulaklık ve akıllı cihazlarda %40\'a varan indirim fırsatını kaçırmayın.',
      discount: '%40 İndirim',
      category: 'teknoloji',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
      badge: 'Sınırlı Süre',
      code: 'TEKNO40',
      bgColor: 'from-slate-900 to-slate-800',
    },
    {
      id: 2,
      title: 'Hafta Sonu Sepet İndirimi',
      description: 'Tüm alışverişlerinizde sepette anında ek %20 indirim uygulanır.',
      discount: 'Ek %20 İndirim',
      category: 'genel',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000&auto=format&fit=crop',
      badge: 'Kaçırılmayacak',
      code: 'SEPET20',
      bgColor: 'from-amber-900 to-stone-800',
    },
    {
      id: 3,
      title: 'Yeni Sezon Oyuncu Ekipmanları',
      description: 'En güçlü performans ürünleri şimdi özel lansman fiyatlarıyla satışta.',
      discount: 'Özel Fiyat',
      category: 'oyuncu',
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1000&auto=format&fit=crop',
      badge: 'Yeni',
      code: 'OYUNCU',
      bgColor: 'from-zinc-900 to-neutral-800',
    },
    {
      id: 4,
      title: 'Ücretsiz Kargo Fırsatı',
      description: '500 TL ve üzeri tüm siparişlerinizde kargo ücreti bizden!',
      discount: 'Bedava Kargo',
      category: 'kargo',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop',
      badge: 'Popüler',
      code: 'Otomatik',
      bgColor: 'from-emerald-900 to-teal-900',
    },
  ];

  // Filtreleme mantığı
  const filteredCampaigns = activeTab === 'tumu' 
    ? campaigns 
    : campaigns.filter(c => c.category === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      {/* Dışardan gelen Header bileşeni */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* SAYFA İÇERİĞİ */}
      <main className="flex-grow pb-20">
        
        {/* 1. HERO / MANŞET BÖLÜMÜ */}
        <section className="relative bg-slate-900 text-white overflow-hidden py-20 px-6 lg:px-12 mb-12">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <img 
              src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=1600&auto=format&fit=crop" 
              alt="Kampanyalar Arka Plan" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-7xl mx-auto text-center space-y-6">
            <span className="inline-block bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
              Özel Fırsatlar & İndirimler
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Sezonun En İyi <span className="text-amber-400">Kampanyaları</span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-300 text-base md:text-lg">
              İhtiyacınız olan binlerce üründe geçerli dev indirimleri, kupon kodlarını ve sürpriz fırsatları burada keşfedin.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6">
          
          {/* 2. KATEGORİ SEKMELERİ (Filtreleme) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {[
              { id: 'tumu', label: 'Tüm Kampanyalar' },
              { id: 'teknoloji', label: 'Teknoloji' },
              { id: 'oyuncu', label: 'Oyuncu Ekipmanları' },
              { id: 'genel', label: 'Genel İndirimler' },
              { id: 'kargo', label: 'Kargo Fırsatları' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition shadow-sm ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 3. KAMPANYA KARTLARI GRID YAPISI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCampaigns.map((camp) => (
              <div 
                key={camp.id}
                className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Görsel ve Badge Alanı */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img 
                    src={camp.image} 
                    alt={camp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Üst Etiketler */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {camp.badge}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {camp.discount}
                    </span>
                  </div>

                  {/* Görsel Üzerindeki Başlık */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-bold tracking-tight mb-1">{camp.title}</h3>
                  </div>
                </div>

                {/* İçerik ve Kupon Kodu Alanı */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-6">
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {camp.description}
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Kupon Kodu:</span>
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded border border-slate-200 text-sm inline-block mt-0.5">
                        {camp.code}
                      </span>
                    </div>

                    <Link 
                      href="/products"
                      className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm"
                    >
                      Fırsatı Yakala
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 4. ALT BİLGİLENDİRME / BÜLTEN KUTUSU */}
          <div className="mt-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Yeni Kampanyalardan İlk Sizin Haberiniz Olsun!</h2>
              <p className="text-amber-100 text-sm md:text-base max-w-xl">
                E-bültenimize abone olarak size özel sürpriz indirim kuponlarını ve flaş indirimleri kaçırmayın.
              </p>
            </div>
            <div className="flex w-full md:w-auto items-center gap-2 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20">
              <input 
                type="email" 
                placeholder="E-posta adresiniz..." 
                className="bg-transparent px-4 py-2.5 text-sm text-white placeholder-amber-200 focus:outline-none w-full md:w-64"
              />
              <button className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-sm whitespace-nowrap">
                Abone Ol
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Dışardan gelen Footer bileşeni */}
      <Footer />

    </div>
  );
}