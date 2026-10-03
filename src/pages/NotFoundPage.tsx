import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (route: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md space-y-6">
        <span className="font-mono text-7xl font-bold text-gold-gradient block">
          404
        </span>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-white">
            {language === 'KZ' ? 'Бет табылмады' : language === 'RU' ? 'Страница не найдена' : 'Page Not Found'}
          </h1>
          <p className="text-xs text-zinc-400">
            {language === 'KZ'
              ? 'Сіз іздеген бөлім жойылған немесе мекенжай қате енгізілген.'
              : 'Запрашиваемый гастрономический раздел не существует или был перемещен.'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('home')}
            className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('navHome')}</span>
          </button>
          <button
            onClick={() => onNavigate('menu')}
            className="px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c378] text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg transition-colors"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>{t('viewMenuBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
