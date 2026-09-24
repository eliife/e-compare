'use client';

export default function HeroMinimal() {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white py-24 lg:py-32 px-6 rounded-3xl mx-6 my-6 shadow-xl border border-slate-800 text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-3.5 py-1.5 rounded-full border border-blue-800/50">
          Yeni Sezon Ürünleri
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Teknolojide <span className="text-slate-400">Yeni Standartlar</span>
        </h1>
        <p className="text-base text-slate-400 max-w-lg mx-auto font-light">
          İhtiyacın olan en son teknoloji cihazlar, minimalist tasarım ve kusursuz alışveriş deneyimiyle burada.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <a
            href="#products"
            className="bg-white text-slate-900 px-8 py-3.5 rounded-xl text-xs font-bold hover:bg-slate-100 transition shadow-md"
          >
            Alışverişe Başla
          </a>
        </div>
      </div>
    </section>
  );
}
