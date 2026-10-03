import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LFLogo } from '../components/LFLogo';
import { Lock, Mail, User, Phone, Calendar, ShieldAlert, ArrowRight, Check } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (route: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const calculateAge = (dateStr: string): number => {
    const birth = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg(t('passwordMinLengthError'));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(t('passwordMismatchError'));
      return;
    }

    const calculatedAge = calculateAge(birthDate);
    if (calculatedAge < 18) {
      setErrorMsg(t('underageError'));
      return;
    }

    if (!agreeTerms) {
      setErrorMsg(t('ageRequiredError'));
      return;
    }

    setLoading(true);
    const res = await register({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      birthDate,
    });
    setLoading(false);

    if (res.success) {
      onNavigate('profile');
    } else {
      setErrorMsg(res.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-[#111116] border border-[#d4af37]/30 rounded-2xl p-7 sm:p-9 shadow-2xl relative">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <LFLogo size="lg" showText={false} />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            {t('register')}
          </h1>
          <p className="text-xs text-amber-400 font-medium mt-1">
            ⚠️ {t('authAgeNotice')}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="font-medium text-zinc-300">{t('fullName')} *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Сұлтан Берікұлы"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#17171e] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-zinc-300">{t('email')} *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="sultan@example.kz"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#17171e] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-zinc-300">{t('phone')} *</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+7 (701) 123-4567"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#17171e] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>

          {/* Birth Date (18+ Verification) */}
          <div className="space-y-1">
            <label className="font-medium text-zinc-300 flex items-center justify-between">
              <span>{t('birthDateLabel')} *</span>
              <span className="text-[11px] text-[#d4af37]">Strictly 18+ required</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="date"
                required
                max={new Date(Date.now() - 18 * 365.25 * 86400 * 1000).toISOString().split('T')[0]}
                value={birthDate}
                onChange={e => setBirthDate(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#17171e] border border-zinc-800 text-white outline-none focus:border-[#d4af37] cursor-pointer"
              />
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-zinc-300">{t('passwordLabel')} *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#17171e] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-zinc-300">{t('confirmPasswordLabel')} *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#17171e] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>

          {/* Terms & 18+ Confirmation */}
          <div className="pt-2 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="regTerms"
              required
              checked={agreeTerms}
              onChange={e => setAgreeTerms(e.target.checked)}
              className="mt-0.5 accent-[#d4af37] cursor-pointer"
            />
            <label htmlFor="regTerms" className="text-[11px] text-zinc-400 cursor-pointer select-none leading-relaxed">
              {t('ageConfirmation18')}. {t('termsOfService')}.
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#e5c378] disabled:opacity-50 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <span>{loading ? 'Creating account...' : t('register')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-400">
          <span>{t('alreadyHaveAccount')} </span>
          <button
            onClick={() => onNavigate('login')}
            className="text-[#d4af37] font-semibold hover:underline cursor-pointer ml-1"
          >
            {t('login')}
          </button>
        </div>
      </div>
    </div>
  );
};
