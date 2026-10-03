import React from 'react';
import { LFLogo } from './LFLogo';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Phone, Clock, Instagram, Facebook, Send, ShieldAlert } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'KZ', label: 'Қазақша' },
    { code: 'RU', label: 'Русский' },
    { code: 'EN', label: 'English' },
  ];

  return (
    <footer className="bg-[#050507] border-t border-[#d4af37]/15 pt-16 pb-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <LFLogo size="lg" />
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mt-3">
              {t('slogan')}. {t('tagline')}.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-500/90 pt-1">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{t('ageWarning18Footer')}</span>
            </div>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#111116] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#111116] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#111116] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-white text-base tracking-wider uppercase">
              {language === 'KZ' ? 'Бөлімдер' : language === 'RU' ? 'Разделы' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer"
                >
                  {t('navHome')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer"
                >
                  {t('navMenu')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reservations')}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer"
                >
                  {t('navReservations')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer"
                >
                  {t('navReviews')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer"
                >
                  {t('navAbout')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer"
                >
                  {t('navContact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div className="space-y-3">
            <h4 className="font-serif text-white text-base tracking-wider uppercase">
              {language === 'KZ' ? 'Мәзір таңдауы' : language === 'RU' ? 'Популярное меню' : 'Culinary Highlights'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer text-left"
                >
                  Гуйру Лағман "Royal"
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer text-left"
                >
                  Хан Мантысы "Royal"
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer text-left"
                >
                  Қытырлақ Баялды "Сайсай"
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer text-left"
                >
                  Қозы Қабырғасы Қосылған Шорпа
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer text-left"
                >
                  Пісте мен Бал қосылған Пахлава
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Hours */}
          <div className="space-y-3">
            <h4 className="font-serif text-white text-base tracking-wider uppercase">
              {t('contactTitle')}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{t('addressValue')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href="tel:+77273456789" className="hover:text-white transition-colors">
                  +7 (727) 345-6789
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{t('openingHoursValue')}</span>
              </div>

              {/* Language Selector */}
              <div className="pt-2">
                <span className="text-xs text-zinc-500 block mb-1.5">Тіл / Язык / Language:</span>
                <div className="flex flex-wrap gap-2">
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                        language === l.code
                          ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10'
                          : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} Lagman Food. {t('rightsReserved')}
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-zinc-300 transition-colors cursor-pointer"
            >
              {t('privacyPolicy')}
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-zinc-300 transition-colors cursor-pointer"
            >
              {t('termsOfService')}
            </button>
            <span className="text-zinc-600">·</span>
            <span className="text-amber-500/80 font-medium">18+ ONLY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
