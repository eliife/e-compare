'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/header'; // Projendeki Header yolu
import Footer from '@/components/footer'; // Projendeki Footer yolu

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tumu');

  // Örnek Blog Yazıları Verisi
  const blogPosts = [
    {
      id: 1,
      title: '2026 Yılında En Çok Tercih Edilen Kablosuz Kulaklık Modelleri',
      excerpt: 'Aktif gürültü engelleme (ANC) teknolojisi, pil ömrü ve ses kalitesiyle öne çıkan en iyi kulaklıkları sizler için inceledik.',
      category: 'inceleme',
      author: 'Ahmet Yılmaz',
      date: '18 Eylül 2026',
      readTime: '4 dk okuma',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
      badge: 'Popüler İnceleme',
    },
    {
      id: 2,
      title: 'Oyuncu Ekipmanı Seçerken Nelere Dikkat Edilmeli?',
      excerpt: 'Mekanik klavyelerden yüksek hassasiyetli oyuncu mouselarına kadar performansınızı artıracak donanım ipuçları.',
      category: 'rehber',
      author: 'Zeynep Demir',
      date: '14 Eylül 2026',
      readTime: '6 dk okuma',
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1000&auto=format&fit=crop',
      badge: 'Alışveriş Rehberi',
    },
    {
      id: 3,
      title: 'Akıllı Ev Teknolojilerinde Yeni Trendler Neler?',
      excerpt: 'Yaşam alanlarınızı daha akıllı, güvenli ve konforlu hale getirecek son nesil teknolojik cihazlar ve entegrasyonları.',
      category: 'teknoloji',
      author: 'Can Demirtaş',
      date: '10 Eylül 2026',
      readTime: '5 dk okuma',
      image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?q=80&w=1000&auto=format&fit=crop',
      badge: 'Trendler',
    },
    {
      id: 4,
      title: 'Alışveriş Yaparken Bütçenizi Korumanın Yolları',
      excerpt: 'Kampanya dönemlerini doğru değerlendirme, kupon kodları ve akıllı fiyat karşılaştırma stratejileri.',
      category: 'rehber',
      author: 'Selin Kaya',
      date: '05 Eylül 2026',
      readTime: '3 dk okuma',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000&auto=format&fit=crop',
      badge: 'Tasarruf',
    },
  ];

  // Kategori filtreleme mantığı
  const filteredPosts = selectedCategory === 'tumu'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      {/* Üst Bilgi (Header) */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Ana İçerik */}
      <main className="flex-grow pb-20">
        
        {/* Blog Hero Alanı */}
        <section className="relative bg-slate-900 text-white overflow-hidden py-20 px-6 lg:px-12 mb-12">
          <div className="absolute inset-0 opacity-30 mix-blend-overlay">
            <img 
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1600&auto=format&fit=crop" 
              alt="Blog Arka Plan" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-7xl mx-auto text-center space-y-4">
            <span className="inline-block bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
              e-compare Blog & Rehberler
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Teknoloji, İncelemeler ve <span className="text-slate-400 font-light">Alışveriş İpuçları</span>
            </h1>
            <p className="max-w-xl mx-auto text-slate-400 text-sm md:text-base">
              En yeni teknolojik trendleri takip edin, ürün incelemelerimizi okuyun ve doğru alışveriş kararları alın.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6">
          
          {/* Kategori Sekmeleri */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {[
              { id: 'tumu', label: 'Tüm Yazılar' },
              { id: 'inceleme', label: 'Ürün İncelemeleri' },
              { id: 'rehber', label: 'Alışveriş Rehberleri' },
              { id: 'teknoloji', label: 'Teknoloji Dünyası' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition shadow-sm ${
                  selectedCategory === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Blog Yazıları Grid Listesi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <article 
                key={post.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Görsel ve Etiket */}
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {post.badge}
                    </span>
                  </div>
                </div>

                {/* Metin İçeriği */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-slate-400 space-x-3">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-slate-700 transition">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Yazar: <strong className="text-slate-800">{post.author}</strong>
                    </span>
                    <Link 
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center text-sm font-semibold text-slate-900 hover:text-slate-600 transition"
                    >
                      Devamını Oku
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </main>

      {/* Alt Bilgi (Footer) */}
      <Footer />

    </div>
  );
}