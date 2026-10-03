import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { getProducts, getReviews } from '../db/storage';
import { ProductCard } from '../components/ProductCard';
import { InteractiveMap } from '../components/InteractiveMap';
import {
  Sparkles,
  ArrowRight,
  Flame,
  ShieldCheck,
  Clock,
  Award,
  ChevronRight,
  Star,
  Quote,
  Calendar,
  UtensilsCrossed,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: string, productId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const [popularDishes, setPopularDishes] = useState<Product[]>([]);
  const [signatureDishes, setSignatureDishes] = useState<Product[]>([]);
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const all = await getProducts();
      setPopularDishes(all.filter(p => p.isPopular).slice(0, 3));
      setSignatureDishes(all.filter(p => p.isSignature).slice(0, 3));
      const revs = await getReviews();
      setReviewsList(revs.slice(0, 3));
    }
    loadData();
  }, []);

  return (
    <div className="space-y-24 sm:space-y-32 pb-20">
      {/* 1. Cinematic Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[#d4af37]/15">
        {/* Background Image with Layered Dark Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_lagman_restaurant_1791006018027.jpg"
            alt="Lagman Food Restaurant Interior & Signature Dishes"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 animate-pulse duration-10000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-[#080809]/80 to-[#080809]/50" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#080809]/60 to-[#080809]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
          {/* Trust Badges Row */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/60 border border-[#d4af37]/30 backdrop-blur-md mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
            <span className="text-xs font-semibold text-[#fef08a] tracking-wider uppercase">
              18+ HAUTE CUISINE · ALMATY
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs text-zinc-300 font-medium hidden sm:inline">
              {t('halalCertified')}
            </span>
          </div>

          {/* Restaurant Title */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 text-balance leading-[1.1]">
            Lagman <span className="text-gold-gradient">Food</span>
          </h1>

          {/* Slogan */}
          <p className="text-lg sm:text-2xl text-zinc-300 max-w-2xl mx-auto font-serif italic mb-10 leading-relaxed text-balance">
            "{t('slogan')}"
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <button
              onClick={() => onNavigate('menu')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e5c378] hover:from-[#e5c378] hover:to-[#d4af37] text-black font-bold text-sm tracking-wide transition-all duration-300 shadow-[0_4px_25px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <UtensilsCrossed className="w-4 h-4 stroke-[2.5]" />
              <span>{t('viewMenuBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('reservations')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#14141a]/90 hover:bg-[#1a1a24] text-white border border-[#d4af37]/40 hover:border-[#d4af37] font-semibold text-sm tracking-wide transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4 text-[#d4af37]" />
              <span>{t('reserveTableBtn')}</span>
            </button>
          </div>

          {/* Features Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pt-8 border-t border-zinc-800/80 text-left">
            <div className="p-3">
              <span className="text-xs text-zinc-500 uppercase tracking-widest block font-medium">Качество</span>
              <p className="font-serif text-base text-white font-semibold mt-0.5">100% Halal Cuts</p>
            </div>
            <div className="p-3">
              <span className="text-xs text-zinc-500 uppercase tracking-widest block font-medium">Шедевры</span>
              <p className="font-serif text-base text-white font-semibold mt-0.5">Hand-Pulled Daily</p>
            </div>
            <div className="p-3">
              <span className="text-xs text-zinc-500 uppercase tracking-widest block font-medium">Формат</span>
              <p className="font-serif text-base text-white font-semibold mt-0.5">Strictly 18+ Lounge</p>
            </div>
            <div className="p-3">
              <span className="text-xs text-zinc-500 uppercase tracking-widest block font-medium">Сервис</span>
              <p className="font-serif text-base text-white font-semibold mt-0.5">Express 45m Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Story / Heritage Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#d4af37] tracking-widest uppercase">
              <Award className="w-4 h-4" />
              <span>{language === 'KZ' ? 'Шеберлік тарихы' : language === 'RU' ? 'История мастерства' : 'Artisanal Heritage'}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight text-balance">
              {language === 'KZ'
                ? 'Қолмен тартылған лағман — гастрономиялық өнер'
                : language === 'RU'
                ? 'Ручная вытяжка лагмана как высокое искусство'
                : 'The Ancient Symphony of Hand-Pulled Noodles'}
            </h2>
            <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
              {language === 'KZ'
                ? 'Lagman Food мейрамханасында әрбір лағман талшығы тәжірибелі шеберлердің қолымен созылады. Біз тек қана таза қазақстандық фермерлік сиыр мен қозы етін, саф дәмдеуіштер мен вок қуыруының биік деңгейін ұсынамыз.'
                : language === 'RU'
                ? 'В Lagman Food каждая нить лапши создается вручную виртуозными мастерами по выверенным вековым пропорциям. Мы используем исключительно отборное фермерское мясо Halal, свежайшие грунтовые овощи и традиционный раскаленный чугунный вок.'
                : 'At Lagman Food, every noodle strand is hand-stretched to order by veteran noodle masters. We unite pristine local Halal meats, heirloom spices, and roaring wok caramelization into an unforgettable gastronomic encounter.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#d4af37] hover:text-[#fef08a] transition-colors cursor-pointer group"
              >
                <span>{language === 'KZ' ? 'Толығырақ білу' : language === 'RU' ? 'Узнать больше о нас' : 'Discover Our Heritage'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/25 shadow-2xl group">
              <img
                src="/src/assets/images/lagman_signature_dish_1791006033068.jpg"
                alt="Artisanal Hand-Pulled Lagman Presentation"
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs text-[#d4af37] tracking-widest uppercase font-semibold block mb-1">
                  Masterpiece of the Day
                </span>
                <p className="font-serif text-xl font-bold text-white">
                  Royal Guyru Lagman with Wok-Glazed Tenderloin
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Popular Dishes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold tracking-wider uppercase mb-1">
              <Flame className="w-4 h-4 fill-[#d4af37]" />
              <span>{t('popularDishesTitle')}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {t('popularDishesSubtitle')}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-300 hover:text-[#d4af37] transition-colors cursor-pointer group"
          >
            <span>{t('viewMenuBtn')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularDishes.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={p => onNavigate('product', p.id)}
            />
          ))}
        </div>
      </section>

      {/* 4. Signature Highlights Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>{t('signatureTitle')}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {t('signatureSubtitle')}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-300 hover:text-[#d4af37] transition-colors cursor-pointer group"
          >
            <span>{t('allCategories')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {signatureDishes.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={p => onNavigate('product', p.id)}
            />
          ))}
        </div>
      </section>

      {/* 5. Restaurant Atmosphere Banner */}
      <section className="relative overflow-hidden py-20 border-y border-[#d4af37]/20 bg-[#0c0c10]">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/restaurant_atmosphere_luxury_1791006045461.jpg"
            alt="Lagman Food Ambiance & Dining Hall"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080809] via-[#080809]/90 to-[#080809]/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-6">
            <span className="text-xs font-semibold text-[#d4af37] tracking-widest uppercase block">
              {t('atmosphereTitle')}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
              {language === 'KZ'
                ? 'Кешкі Алматының ең сәнді әрі жұмбақ мекені'
                : language === 'RU'
                ? 'Элегантное уединение и вечерняя роскошь'
                : 'Atmospheric Luxury for Connoisseurs'}
            </h2>
            <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
              {t('atmosphereDesc')}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => onNavigate('reservations')}
                className="px-6 py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c378] text-black font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('reserveTableBtn')}</span>
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 rounded-xl bg-black/60 hover:bg-black text-white border border-zinc-700 hover:border-zinc-500 font-semibold text-sm transition-all cursor-pointer"
              >
                {t('navContact')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Guest Reviews Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs text-[#d4af37] tracking-widest uppercase font-semibold">
            {t('reviewsSectionTitle')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">
            {language === 'KZ' ? 'Біздің қонақтар не дейді?' : language === 'RU' ? 'Что говорят наши гости' : 'Verified Dining Impressions'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewsList.map(rev => (
            <div
              key={rev.id}
              className="bg-[#101014] p-6 rounded-xl border border-zinc-800/80 hover:border-[#d4af37]/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#d4af37]/30" />
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed italic mb-6">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">{rev.userName}</p>
                  {rev.dishName && (
                    <p className="text-[#d4af37] text-[11px] truncate max-w-[180px]">{rev.dishName}</p>
                  )}
                </div>
                <span className="text-zinc-500">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => onNavigate('reviews')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#d4af37] hover:text-[#fef08a] transition-colors cursor-pointer"
          >
            <span>{t('allReviewsTitle')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 7. Reservation CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-[#171510] via-[#101014] to-[#121218] border border-[#d4af37]/30 shadow-2xl text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white text-balance">
              {t('reservationCtaTitle')}
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 text-balance leading-relaxed">
              {t('reservationCtaSubtitle')}
            </p>
            <div className="pt-4">
              <button
                onClick={() => onNavigate('reservations')}
                className="px-8 py-4 rounded-xl bg-[#d4af37] hover:bg-[#e5c378] text-black font-bold text-sm tracking-wide transition-all shadow-[0_4px_25px_rgba(212,175,55,0.3)] cursor-pointer inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('reserveTableBtn')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Interactive Location Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs text-[#d4af37] tracking-widest uppercase font-semibold">
            {t('navContact')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
            {t('contactTitle')}
          </h2>
        </div>
        <InteractiveMap />
      </section>
    </div>
  );
};
