import React from 'react';
import { Check, Sparkles, ArrowRight, Calendar, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SuccessModalProps {
  isOpen: boolean;
  type: 'order' | 'reservation';
  referenceNumber: string;
  details?: string;
  onClose: () => void;
  onViewAction: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  type,
  referenceNumber,
  details,
  onClose,
  onViewAction,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const isOrder = type === 'order';
  const title = isOrder ? t('orderSuccessTitle') : t('reservationSuccessTitle');
  const description = isOrder ? t('orderSuccessDesc') : t('reservationSuccessDesc');
  const actionLabel = isOrder ? t('trackOrderBtn') : t('myReservationsBtn');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md bg-[#121216] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(212,175,55,0.25)] overflow-hidden">
        {/* Ambient Gold Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Icon */}
        <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#d4af37]/30 animate-ping opacity-60" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1a1710] to-[#2c2415] border border-[#d4af37] flex items-center justify-center text-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-[#fef08a] animate-bounce" />
        </div>

        {/* Title & Description */}
        <h3 className="font-serif text-2xl font-bold text-white mb-2">
          {title}
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed mb-6">
          {description}
        </p>

        {/* Reference Box */}
        <div className="p-3.5 rounded-xl bg-[#191920] border border-[#d4af37]/20 mb-6 inline-flex flex-col items-center justify-center w-full">
          <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
            {isOrder ? t('orderNumberLabel') : 'Reservation Ref:'}
          </span>
          <span className="font-mono text-xl font-bold text-gold-gradient mt-1">
            {referenceNumber}
          </span>
          {details && (
            <span className="text-xs text-zinc-300 mt-1">{details}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onViewAction}
            className="w-full py-3 px-4 rounded-xl bg-[#d4af37] hover:bg-[#e5c378] text-black font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            {isOrder ? <ShoppingBag className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            {t('navMenu')}
          </button>
        </div>
      </div>
    </div>
  );
};
