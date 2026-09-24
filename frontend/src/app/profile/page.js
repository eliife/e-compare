'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import API from '@/services/api';

export default function ProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  
  // Siparişler için state'ler
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Adresler için state'ler
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null); // Düzenlenen adresin ID'si
  const [newAddress, setNewAddress] = useState({
    title: '',
    fullName: '',
    addressLine: '',
    city: '',
    district: '',
    phone: ''
  });

  const dispatch = useDispatch();
  const router = useRouter();
  
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const totalItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (isMounted && !user) {
      router.push('/login');
    }
  }, [isMounted, user, router]);

  // Siparişleri çek
  useEffect(() => {
    if (isMounted && user && activeTab === 'orders') {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const response = await API.get('/orders');
          setOrders(response.data.orders || response.data || []);
        } catch (err) {
          console.warn('Sipariş endpointi henüz oluşturulmadı:', err.message);
          setOrders([]);
        } finally {
          setLoadingOrders(false);
        }
      };

      fetchOrders();
    }
  }, [isMounted, user, activeTab]);

  // Adresleri çek
  useEffect(() => {
    if (isMounted && user && activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [isMounted, user, activeTab]);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await API.get('/addresses');
      setAddresses(response.data.addresses || response.data || []);
    } catch (err) {
      console.warn('Adres endpointi getirilemedi:', err.message);
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Yeni Adres Kaydet veya Varolanı Güncelle
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        // Güncelleme isteği (PUT) - Backend'inde router.put('/:id', ...) tanımlı olmalı
        await API.put(`/addresses/${editingAddressId}`, newAddress);
      } else {
        // Yeni ekleme isteği (POST)
        await API.post('/addresses', newAddress);
      }

      // Formu sıfırla ve kapat
      setNewAddress({ title: '', fullName: '', addressLine: '', city: '', district: '', phone: '' });
      setEditingAddressId(null);
      setShowAddressForm(false);
      fetchAddresses(); // Listeyi güncelle
    } catch (err) {
      alert('İşlem başarısız oldu: ' + (err.response?.data?.message || err.message));
    }
  };

  // Düzenleme modunu aç ve bilgileri forma doldur
  const handleEditClick = (addr) => {
    setEditingAddressId(addr._id || addr.id);
    setNewAddress({
      title: addr.title || '',
      fullName: addr.fullName || '',
      addressLine: addr.addressLine || '',
      city: addr.city || '',
      district: addr.district || '',
      phone: addr.phone || ''
    });
    setShowAddressForm(true);
  };

  // Formu kapatırken state'leri sıfırla
  const handleToggleForm = () => {
    if (showAddressForm) {
      setEditingAddressId(null);
      setNewAddress({ title: '', fullName: '', addressLine: '', city: '', district: '', phone: '' });
    }
    setShowAddressForm(!showAddressForm);
  };

  // Adres Sil
  const handleDeleteAddress = async (id) => {
    if (!confirm('Bu adresi silmek istediğinize emin misiniz?')) return;
    try {
      await API.delete(`/addresses/${id}`);
      fetchAddresses();
    } catch (err) {
      alert('Adres silinemedi.');
    }
  };

  if (!isMounted || !user) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-slate-900 selection:text-white">
      {/* Üst Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900 lowercase">
              e-<span className="text-slate-600 font-normal">compare</span>
            </Link>

            <div className="hidden sm:flex items-center bg-[#f4f0eb] rounded-full px-5 py-2.5 w-72 border border-transparent focus-within:border-slate-300 transition">
              <svg className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                placeholder="Ürün ara..."
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-slate-950 transition">Çok Satanlar</Link>
            <Link href="/" className="hover:text-slate-950 transition">Yeni Gelenler</Link>
            <Link href="/" className="hover:text-slate-950 transition">Kampanyalar</Link>
            <Link href="/" className="hover:text-slate-950 transition">Kuponlar</Link>
            <Link href="/" className="hover:text-slate-950 transition">Blog</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:border-slate-400 transition bg-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>

            <Link href="/profile" className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:border-slate-400 transition bg-slate-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </Link>

            <Link 
              href="/cart" 
              className="relative w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:border-slate-400 transition bg-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#4a5542] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Profil İçerik Alanı */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-serif text-slate-800 tracking-tight">Hesabım</h1>
          <p className="text-sm text-slate-500 mt-1">
            Hoş geldiniz, <span className="font-medium text-slate-800">{user.name || user.email.split('@')[0]}</span>[cite: 5]
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          
          {/* Sol Menü (Sidebar) */}
          <aside className="lg:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-5 py-3 rounded-xl text-sm font-medium transition text-left ${
                activeTab === 'profile' ? 'bg-[#434b3f] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>Profil</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 px-5 py-3 rounded-xl text-sm font-medium transition text-left ${
                activeTab === 'orders' ? 'bg-[#434b3f] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              <span>Siparişlerim</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center space-x-3 px-5 py-3 rounded-xl text-sm font-medium transition text-left ${
                activeTab === 'addresses' ? 'bg-[#434b3f] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>Adreslerim</span>
            </button>

            <div className="pt-4 border-t border-slate-100 space-y-1">
              <Link href="/favorites" className="w-full flex items-center space-x-3 px-5 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <span>Favorilerim</span>
              </Link>

              <Link href="/cart" className="w-full flex items-center space-x-3 px-5 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <span>Sepetim</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-5 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition text-left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>Çıkış Yap</span>
              </button>
            </div>
          </aside>

          {/* Sağ İçerik Alanı */}
          <div className="lg:col-span-3">
            
            {/* PROFİL */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Profil Bilgileri</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Hesap bilgilerinizi görüntüleyin.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                  <div>
                    <span className="block text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-1">AD SOYAD</span>
                    <p className="text-sm font-medium text-slate-800">{user.name || 'Belirtilmemiş'}</p>
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-1">E-POSTA</span>
                    <p className="text-sm font-medium text-slate-800">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* SİPARİŞLERİM */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm">
                  {loadingOrders ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4 text-left">
                      {orders.map((order) => (
                        <div key={order._id || order.id} className="border border-slate-200 rounded-xl p-5 flex justify-between items-center">
                          <div>
                            <p className="text-xs font-bold text-slate-900">Sipariş ID: #{order._id?.slice(-6) || '---'}</p>
                            <p className="text-xs text-slate-500 mt-1">Toplam Tutar: <span className="font-semibold text-slate-800">{order.totalPrice || order.price} ₺</span></p>
                          </div>
                          <Link href="/" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition">
                            Detaylar
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 space-y-4">
                      <p className="text-sm text-slate-500">Henüz siparişiniz bulunmuyor.</p>
                      <Link href="/" className="inline-block bg-[#434b3f] hover:bg-[#363d33] text-white text-xs font-medium px-8 py-3 rounded-full transition shadow-sm">
                        Alışverişe Başla
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ADRESLERİM */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Adreslerim</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Kayıtlı teslimat adreslerinizi yönetin.</p>
                  </div>
                  <button
                    onClick={handleToggleForm}
                    className="bg-[#434b3f] hover:bg-[#363d33] text-white text-xs font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
                  >
                    {showAddressForm ? 'İptal Et' : '+ Yeni Adres Ekle'}
                  </button>
                </div>

                {/* Adres Ekleme / Düzenleme Formu */}
                {showAddressForm && (
                  <form onSubmit={handleAddressSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      {editingAddressId ? 'Adresi Düzenle' : 'Yeni Adres Bilgileri'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Adres Başlığı (Örn: Ev, İş)"
                        required
                        value={newAddress.title}
                        onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                        className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-slate-400"
                      />
                      <input
                        type="text"
                        placeholder="Ad Soyad (Teslim alacak kişi)"
                        required
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-slate-400"
                      />
                      <input
                        type="text"
                        placeholder="Telefon Numarası"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-slate-400"
                      />
                      <input
                        type="text"
                        placeholder="İl"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-slate-400"
                      />
                      <input
                        type="text"
                        placeholder="İlçe"
                        required
                        value={newAddress.district}
                        onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                        className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-slate-400"
                      />
                    </div>
                    <textarea
                      placeholder="Açık Adres (Mahalle, Sokak, No, Daire)"
                      required
                      rows="3"
                      value={newAddress.addressLine}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-slate-400"
                    />
                    <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium py-3 rounded-xl transition shadow-sm">
                      {editingAddressId ? 'Adresi Güncelle' : 'Adresi Kaydet'}
                    </button>
                  </form>
                )}

                {/* Adres Listesi / Boş Durum */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm">
                  {loadingAddresses ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                    </div>
                  ) : addresses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div key={addr._id || addr.id} className="border border-slate-200 rounded-xl p-5 relative flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">{addr.title}</span>
                              <div className="flex items-center space-x-3">
                                <button onClick={() => handleEditClick(addr)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                                  Düzenle
                                </button>
                                <button onClick={() => handleDeleteAddress(addr._id || addr.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">
                                  Sil
                                </button>
                              </div>
                            </div>
                            <p className="text-xs font-semibold text-slate-800 mt-2">Alıcı: {addr.fullName}</p>
                            <p className="text-xs text-slate-700 mt-1">{addr.addressLine}</p>
                            <p className="text-xs text-slate-500 mt-1">{addr.district} / {addr.city}</p>
                          </div>
                          <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-2">Tel: {addr.phone}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center space-y-4">
                      <p className="text-sm text-slate-500">Kayıtlı bir adresiniz bulunmuyor[cite: 5].</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate-400 mt-20">
        <p>© 2026 e-compare. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}