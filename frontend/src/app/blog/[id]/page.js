'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function BlogDetailPage() {
  const params = useParams();
  const id = params?.id || '1';
  const [searchTerm, setSearchTerm] = useState('');

  // Tüm blog yazılarına ait detay verileri
  const blogPostsData = {
    '1': {
      title: '2026 Yılında En Çok Tercih Edilen Kablosuz Kulaklık Modelleri',
      category: 'Ürün İncelemeleri',
      author: 'Ahmet Yılmaz',
      authorRole: 'Teknoloji Editörü',
      date: '18 Eylül 2026',
      readTime: '4 dk okuma',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
      content: [
        {
          type: 'paragraph',
          text: 'Teknolojinin hızla gelişmesiyle birlikte kablosuz kulaklıklar hayatımızın vazgeçilmez bir parçası haline geldi. Özellikle aktif gürültü engelleme (ANC) teknolojisindeki gelişmeler, kullanıcıların dış dünya ile bağını tamamen koparıp saf müzik deneyimi yaşamasını sağlıyor. Bu yazımızda, 2026 yılının en iddialı modellerini masaya yatırıyoruz.'
        },
        {
          type: 'heading',
          text: 'Aktif Gürültü Engelleme (ANC) Neden Bu Kadar Önemli?'
        },
        {
          type: 'paragraph',
          text: 'Metroda, kafede ya da açık ofislerde çalışanlar için dış sesler büyük bir dikkat dağıtıcı unsurdur. Gelişmiş ANC çipleri, düşük frekanslı sesleri %95’e varan oranlarda filtreleyerek adeta sessiz bir vaha yaratır. Seçim yaparken hibrit ANC sunan modelleri tercih etmek her zaman avantaj sağlar.'
        },
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop',
          caption: 'Ergonomik tasarım ve uzun pil ömrü kulaklık seçiminde en kritik kriterlerdir.'
        },
        {
          type: 'heading',
          text: 'Pil Ömrü ve Şarj Kutusu Performansı'
        },
        {
          type: 'paragraph',
          text: 'Günümüz standartlarında tek şarjla 8-10 saat kesintisiz müzik dinleme süresi beklenmektedir. Şarj kutusuyla birlikte bu sürenin 35-40 saati bulması, kullanıcı deneyimini doğrudan yukarı çeken en önemli detaydır.'
        }
      ]
    },
    '2': {
      title: 'Oyuncu Ekipmanı Seçerken Nelere Dikkat Edilmeli?',
      category: 'Alışveriş Rehberleri',
      author: 'Zeynep Demir',
      authorRole: 'Donanım Uzmanı',
      date: '14 Eylül 2026',
      readTime: '6 dk okuma',
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop',
      content: [
        {
          type: 'paragraph',
          text: 'Rekabetçi oyunlarda başarı, milisaniyelerin bile önem taşıdığı anlarda kullanılan ekipmanlarla doğrudan ilişkilidir. Mekanik klavyelerden yüksek DPI sensörlü mouselara kadar doğru parçaları seçmek performansınızı ikiye katlayabilir.'
        },
        {
          type: 'heading',
          text: 'Mekanik Klavye Switch Seçimleri'
        },
        {
          type: 'paragraph',
          text: 'Kırmızı (Red), mavi (Blue) veya kahverengi (Brown) switchler arasındaki farkları bilmek oyun tarzınıza en uygun seçimi yapmanızı sağlar. Ses ve basış hissiyatı tamamen kişisel tercihlere dayanır.'
        },
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1000&auto=format&fit=crop',
          caption: 'Doğru klavye ve mouse kombinasyonu oyun hakimiyetini artırır.'
        }
      ]
    },
    '3': {
      title: 'Akıllı Ev Teknolojilerinde Yeni Trendler Neler?',
      category: 'Teknoloji Dünyası',
      author: 'Can Demirtaş',
      authorRole: 'Akıllı Sistemler Uzmanı',
      date: '10 Eylül 2026',
      readTime: '5 dk okuma',
      image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?q=80&w=1200&auto=format&fit=crop',
      content: [
        {
          type: 'paragraph',
          text: 'Yaşam alanlarımızı daha akıllı, güvenli ve konforlu hale getirecek son nesil teknolojik cihazlar her geçen gün hayatımıza daha fazla entegre oluyor. Otomasyon sistemleri artık bir lüks değil, standart bir ihtiyaç haline geldi.'
        },
        {
          type: 'heading',
          text: 'Enerji Verimliliği ve Akıllı Sensörler'
        },
        {
          type: 'paragraph',
          text: 'Akıllı termostatlar ve aydınlatma sistemleri, enerji tasarrufu sağlayarak hem bütçenizi korur hem de çevreye duyarlı bir yaşam alanı sunar. Yapay zeka destekli asistanlar ise tüm bu cihazları tek bir merkezden yönetmenize olanak tanır.'
        }
      ]
    },
    '4': {
      title: 'Alışveriş Yaparken Bütçenizi Korumanın Yolları',
      category: 'Alışveriş Rehberleri',
      author: 'Selin Kaya',
      authorRole: 'Tüketici Hakları & Finans Yazarı',
      date: '05 Eylül 2026',
      readTime: '3 dk okuma',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop',
      content: [
        {
          type: 'paragraph',
          text: 'Kampanya dönemlerini doğru değerlendirmek, kupon kodlarını etkin kullanmak ve fiyat karşılaştırma platformlarından yararlanmak bütçe dostu alışverişin temelini oluşturur.'
        },
        {
          type: 'heading',
          text: 'Fiyat Geçmişini Takip Etmek Neden Önemli?'
        },
        {
          type: 'paragraph',
          text: 'İndirim dönemlerinde yapılan büyük kampanyaların her zaman gerçek indirimler olmadığını fiyat grafiklerini inceleyerek anlayabilirsiniz. e-compare gibi platformlar üzerinden fiyat geçmişini kontrol etmek en doğru kararı vermenizi sağlar.'
        }
      ]
    }
  };

  // Gelen ID'ye göre yazıyı seç, bulamazsa ilk yazıyı yedek olarak göster
  const post = blogPostsData[id] || blogPostsData['1'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      {/* Üst Bilgi (Header) */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Ana İçerik */}
      <main className="flex-grow py-12 px-6">
        <article className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-8 md:p-12">
          
          {/* Geri Dön Butonu ve Kategori */}
          <div className="flex items-center justify-between mb-6">
            <Link 
              href="/blog"
              className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
              </svg>
              Blog Listesine Dön
            </Link>
            <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>

          {/* Makale Başlığı */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Yazar Bilgileri ve Tarih */}
          <div className="flex items-center justify-between border-y border-slate-100 py-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-lg">
                {post.author.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{post.author}</h3>
                <p className="text-xs text-slate-500">{post.authorRole}</p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-400 space-y-1">
              <p>{post.date}</p>
              <p>{post.readTime}</p>
            </div>
          </div>

          {/* Kapak Görseli */}
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-10 bg-slate-100">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Makale Gövdesi / İçerik Blokları */}
          <div className="space-y-6 text-slate-700 leading-relaxed text-base md:text-lg">
            {post.content.map((block, index) => {
              if (block.type === 'paragraph') {
                return <p key={index}>{block.text}</p>;
              } else if (block.type === 'heading') {
                return <h2 key={index} className="text-2xl font-bold text-slate-900 pt-4 pb-2">{block.text}</h2>;
              } else if (block.type === 'image') {
                return (
                  <figure key={index} className="my-8">
                    <img src={block.url} alt={block.caption} className="w-full rounded-xl object-cover h-80" />
                    <figcaption className="text-center text-xs text-slate-400 mt-2">{block.caption}</figcaption>
                  </figure>
                );
              }
              return null;
            })}
          </div>

          {/* Alt Paylaşım / Etkileşim Alanı */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600 font-medium">
              Bu yazıyı faydalı buldunuz mu? Arkadaşlarınızla paylaşın!
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition">
                Bağlantıyı Kopyala
              </button>
              <Link 
                href="/products" 
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2 rounded-xl transition shadow-sm"
              >
                Ürünleri İncele
              </Link>
            </div>
          </div>

        </article>
      </main>

      {/* Alt Bilgi (Footer) */}
      <Footer />

    </div>
  );
}