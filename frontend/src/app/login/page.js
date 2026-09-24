'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const resultAction = await dispatch(loginUser({ email, password }));
    
    if (loginUser.fulfilled.match(resultAction)) {
      router.push('/');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-100 p-8 shadow-sm">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900 lowercase">
            e-<span className="text-slate-600 font-normal">compare</span>
          </Link>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Hesabınıza Giriş Yapın</h2>
          <p className="mt-1 text-xs text-slate-500">Kaldığınız yerden alışverişe devam edin.</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-center text-xs font-medium text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">E-posta Adresi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-slate-900 focus:bg-white focus:outline-none transition"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-slate-900 focus:bg-white focus:outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-sm disabled:bg-slate-400"
          >
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Hesabınız yok mu?{' '}
          <Link href="/register" className="font-semibold text-slate-900 hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}