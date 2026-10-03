import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { InteractiveMap } from '../components/InteractiveMap';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (route: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const [formSent, setFormSent] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestMessage, setGuestMessage] = useState('');

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setGuestName('');
      setGuestPhone('');
      setGuestMessage('');
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <span className="text-xs text-[#d4af37] font-semibold tracking-widest uppercase">
          RESTAURANT LOCATION
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          {t('contactTitle')}
        </h1>
        <p className="text-sm text-zinc-400">
          {t('addressValue')}
        </p>
      </div>

      {/* Interactive Map Component */}
      <InteractiveMap />

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#111116] border border-zinc-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-bold text-white">{t('navContact')}</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">{t('addressValue')}</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#111116] border border-zinc-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-bold text-white">{t('openingHoursLabel')}</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">{t('openingHoursValue')}</p>
          <span className="text-[11px] text-emerald-400 block font-medium">Open 7 days a week</span>
        </div>

        <div className="p-6 rounded-2xl bg-[#111116] border border-zinc-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-bold text-white">{t('phoneLabel')}</h3>
          <a
            href="tel:+77273456789"
            className="text-xs font-mono font-bold text-[#d4af37] hover:underline block"
          >
            +7 (727) 345-6789
          </a>
          <p className="text-[11px] text-zinc-400">Concierge & VIP reservations</p>
        </div>
      </div>

      {/* Banquet / Special Event Inquiry Form */}
      <div className="p-8 sm:p-10 rounded-2xl bg-[#111116] border border-[#d4af37]/30 max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h3 className="font-serif text-2xl font-bold text-white">
            {language === 'KZ' ? 'Жеке іс-шараға сұраныс қалдыру' : language === 'RU' ? 'Заявка на закрытое мероприятие' : 'Private Dining & Event Inquiries'}
          </h3>
          <p className="text-xs text-zinc-400">
            {language === 'KZ'
              ? 'VIP-зал, корпоративтік кешкі ас немесе ерекше мерекелер үшін бізге хабарласыңыз'
              : 'Для бронирования VIP-зала, делового банкета или особого торжества'}
          </p>
        </div>

        {formSent ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>
              {language === 'KZ'
                ? 'Өтінішіңіз қабылданды! Менеджер 15 минутта хабарласады.'
                : 'Заявка принята! Управляющий свяжется с вами в течение 15 минут.'}
            </span>
          </div>
        ) : (
          <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder={t('fullName')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#171720] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
              />
              <input
                type="tel"
                required
                value={guestPhone}
                onChange={e => setGuestPhone(e.target.value)}
                placeholder={t('phone')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#171720] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
              />
            </div>
            <textarea
              rows={3}
              required
              value={guestMessage}
              onChange={e => setGuestMessage(e.target.value)}
              placeholder={language === 'KZ' ? 'Қонақтар саны және күні...' : 'Количество гостей, желаемая дата и пожелания...'}
              className="w-full px-3.5 py-2 rounded-xl bg-[#171720] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c378] text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
            >
              {language === 'KZ' ? 'Өтінішті жіберу' : language === 'RU' ? 'Отправить запрос' : 'Send Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
