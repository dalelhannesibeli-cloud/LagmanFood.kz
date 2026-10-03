import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { createReservation } from '../db/storage';
import { Reservation, SeatingArea } from '../types';
import { SuccessModal } from '../components/SuccessModal';
import { Calendar as CalendarIcon, Clock, Users, Sparkles, MapPin, Check, ShieldAlert } from 'lucide-react';

interface ReservationPageProps {
  onNavigate: (route: string) => void;
}

export const ReservationPage: React.FC<ReservationPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  // Tomorrow as default date
  const tomorrowStr = new Date(Date.now() + 86400 * 1000).toISOString().split('T')[0];

  const [date, setDate] = useState(tomorrowStr);
  const [time, setTime] = useState('19:00');
  const [guestsCount, setGuestsCount] = useState(2);
  const [seatingArea, setSeatingArea] = useState<SeatingArea>('main');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Confirmation Modal
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const timeSlots = [
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '21:30'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg(language === 'KZ' ? 'Аты-жөніңізді енгізіңіз' : 'Пожалуйста, укажите имя');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg(language === 'KZ' ? 'Телефон нөмірін енгізіңіз' : 'Пожалуйста, укажите телефон');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createReservation({
        userId: user?.id || 'guest-anon',
        guestName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        date,
        time,
        guestsCount,
        seatingArea,
        comment: comment.trim(),
      });

      setConfirmedReservation(res);
    } catch {
      setErrorMsg('Failed to reserve table. Please check inputs and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs text-[#d4af37] font-semibold tracking-widest uppercase">
          18+ VIP BOOKING
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          {t('reservationTitle')}
        </h1>
        <p className="text-sm text-zinc-400">
          {t('reservationSubtitle')}
        </p>
      </div>

      {/* Main Reservation Card */}
      <div className="bg-[#101014] rounded-2xl border border-[#d4af37]/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Date & Time & Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{t('selectDate')}</span>
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171e] border border-zinc-800 text-white text-xs outline-none focus:border-[#d4af37] cursor-pointer"
              />
            </div>

            {/* Time Slots */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{t('selectTime')}</span>
              </label>
              <select
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171e] border border-zinc-800 text-white text-xs outline-none focus:border-[#d4af37] cursor-pointer"
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {/* Guests Count */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{t('guestsCount')}</span>
              </label>
              <select
                value={guestsCount}
                onChange={e => setGuestsCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171e] border border-zinc-800 text-white text-xs outline-none focus:border-[#d4af37] cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 2: Seating Area Choice */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 block">
              {t('seatingArea')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-4 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all ${
                  seatingArea === 'main'
                    ? 'border-[#d4af37] bg-[#d4af37]/10 text-white shadow-md'
                    : 'border-zinc-800 bg-[#141419] text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{t('areaMain')}</span>
                  <input
                    type="radio"
                    name="area"
                    checked={seatingArea === 'main'}
                    onChange={() => setSeatingArea('main')}
                    className="accent-[#d4af37]"
                  />
                </div>
                <span className="text-[11px] text-zinc-400 mt-1">
                  Atmospheric candlelit dining hall
                </span>
              </label>

              <label
                className={`p-4 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all ${
                  seatingArea === 'vip'
                    ? 'border-[#d4af37] bg-[#d4af37]/10 text-white shadow-md'
                    : 'border-zinc-800 bg-[#141419] text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{t('areaVip')}</span>
                  <input
                    type="radio"
                    name="area"
                    checked={seatingArea === 'vip'}
                    onChange={() => setSeatingArea('vip')}
                    className="accent-[#d4af37]"
                  />
                </div>
                <span className="text-[11px] text-zinc-400 mt-1">
                  Private acoustic room with dedicated butler
                </span>
              </label>

              <label
                className={`p-4 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all ${
                  seatingArea === 'terrace'
                    ? 'border-[#d4af37] bg-[#d4af37]/10 text-white shadow-md'
                    : 'border-zinc-800 bg-[#141419] text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{t('areaTerrace')}</span>
                  <input
                    type="radio"
                    name="area"
                    checked={seatingArea === 'terrace'}
                    onChange={() => setSeatingArea('terrace')}
                    className="accent-[#d4af37]"
                  />
                </div>
                <span className="text-[11px] text-zinc-400 mt-1">
                  Panoramic heated terrace with mountain view
                </span>
              </label>
            </div>
          </div>

          {/* Step 3: Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-400">{t('fullName')} *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Сұлтан Берікұлы"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171e] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">{t('phone')} *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+7 (701) 000-0000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171e] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">{t('email')}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="guest@example.kz"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171e] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-zinc-400">{t('specialRequests')}</label>
              <textarea
                rows={2}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#17171e] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-[#d4af37] hover:bg-[#e5c378] disabled:opacity-50 text-black font-bold text-sm tracking-wide transition-all shadow-[0_4px_25px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Confirming...' : t('submitReservation')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {confirmedReservation && (
        <SuccessModal
          isOpen={true}
          type="reservation"
          referenceNumber={confirmedReservation.reservationNumber}
          details={`${confirmedReservation.date} at ${confirmedReservation.time} · ${confirmedReservation.guestsCount} Guests`}
          onClose={() => {
            setConfirmedReservation(null);
            onNavigate('home');
          }}
          onViewAction={() => {
            setConfirmedReservation(null);
            onNavigate('reservations-list');
          }}
        />
      )}
    </div>
  );
};
