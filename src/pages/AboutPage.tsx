import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Award, Flame, UtensilsCrossed, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20">
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs text-[#d4af37] font-semibold tracking-widest uppercase">
          OUR CULINARY MANIFESTO
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white tracking-tight">
          {t('brandName')}
        </h1>
        <p className="font-serif italic text-lg sm:text-2xl text-zinc-300">
          "{t('slogan')}"
        </p>
      </div>

      {/* Grid: Philosophy & Tradition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>{language === 'KZ' ? 'Дәстүр мен шеберлік' : language === 'RU' ? 'Традиции и мастерство' : 'Tradition & Artistry'}</span>
          </div>

          <h2 className="font-serif text-3xl font-bold text-white">
            {language === 'KZ'
              ? 'Тұңғыш премиум лағман кеңістігі'
              : language === 'RU'
              ? 'Первое пространство премиального лагмана'
              : 'Pioneering Haute Central Asian Dining'}
          </h2>

          <p className="text-sm text-zinc-300 leading-relaxed">
            {language === 'KZ'
              ? 'Lagman Food қарапайым көше тағамы ретінде танылған лағманды мишлендік деңгейдегі авторлық гастрономияға айналдырды. Біздің шеберлеріміз қамырдың температурасы мен серпімділігін секундына дейін өлшеп, әрбір талшықты қолмен тартады.'
              : language === 'RU'
              ? 'Lagman Food переосмыслил классический тянутый лагман, возведя традиционную рецептуру в ранг высокой ресторанной эстетики. Наши мастера вручную вытягивают каждую порцию лапши из отборной пшеницы твердых сортов прямо перед подачей.'
              : 'Lagman Food has redefined hand-pulled noodles into a fine-dining spectacle. Our noodle artisans stretch each delicate strand to order using heirloom heirloom heritage methods, celebrating centuries of Central Asian and Uyghur culinary excellence.'}
          </p>

          <p className="text-sm text-zinc-300 leading-relaxed">
            {language === 'KZ'
              ? 'Тек қана 100% Халал сертификатталған жас қозы мен сиыр еті, ең таңдаулы жергілікті көкөністер және сапалы табиғи майлар қолданылады.'
              : language === 'RU'
              ? 'Мы используем исключительно 100% Halal отборную телятину и ягнятину свободного выпаса, экологически чистые грунтовые овощи и традиционные пряности шелкового пути.'
              : 'We source exclusively certified 100% Halal pasture-raised meats, pristine regional vegetables, and hand-ground Silk Road botanicals.'}
          </p>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl">
            <img
              src="/src/assets/images/lagman_signature_dish_1791006033068.jpg"
              alt="Culinary Process"
              referrerPolicy="no-referrer"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-7 rounded-2xl bg-[#111116] border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-white">Handmade to Order</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Never precooked or frozen. Every noodle strand is hand-stretched and plunged into boiling water moments before serving.
          </p>
        </div>

        <div className="p-7 rounded-2xl bg-[#111116] border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-white">Roaring Wok Breath</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Authentic cast-iron wok wok-hei locks in crisp vegetable vitality, smoky caramelization, and succulent beef tenderness.
          </p>
        </div>

        <div className="p-7 rounded-2xl bg-[#111116] border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-white">18+ Refined Sanctum</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            A serene, mature dining sanctuary designed exclusively for adults seeking exceptional conversation, wine, and gourmet dining.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-8">
        <button
          onClick={() => onNavigate('reservations')}
          className="px-8 py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c378] text-black font-bold text-sm tracking-wider uppercase transition-all shadow-[0_4px_25px_rgba(212,175,55,0.3)] cursor-pointer"
        >
          {t('reserveTableBtn')}
        </button>
      </div>
    </div>
  );
};
