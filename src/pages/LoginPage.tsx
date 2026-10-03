import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LFLogo } from '../components/LFLogo';
import { Lock, Mail, ShieldAlert, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { login } = useAuth();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(emailOrPhone, password);
    setLoading(false);

    if (res.success) {
      onNavigate('profile');
    } else {
      setErrorMsg(res.error || 'Invalid credentials.');
    }
  };

  const handleFillDemo = (type: 'customer' | 'admin') => {
    if (type === 'admin') {
      setEmailOrPhone('admin@lagmanfood.kz');
      setPassword('LagmanAdmin2026!');
    } else {
      setEmailOrPhone('guest@lagmanfood.kz');
      setPassword('LagmanFood18+');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#111116] border border-[#d4af37]/30 rounded-2xl p-7 sm:p-9 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <LFLogo size="lg" showText={false} />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            {t('login')}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {t('authAgeNotice')}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Email / {t('phone')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={e => setEmailOrPhone(e.target.value)}
                placeholder="guest@lagmanfood.kz"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#17171e] border border-zinc-800 text-white text-xs outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#17171e] border border-zinc-800 text-white text-xs outline-none focus:border-[#d4af37]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#e5c378] disabled:opacity-50 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{loading ? '...' : t('login')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="mt-6 pt-5 border-t border-zinc-800 space-y-2.5">
          <span className="text-[11px] text-zinc-500 block text-center uppercase tracking-wider font-semibold">
            {t('quickDemoLogin')}
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleFillDemo('customer')}
              className="py-2 px-2.5 rounded-lg bg-[#181822] hover:bg-[#20202c] border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer text-center"
            >
              👤 {t('loginAsCustomer')}
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="py-2 px-2.5 rounded-lg bg-[#181822] hover:bg-[#20202c] border border-zinc-800 text-[#d4af37] hover:text-[#fef08a] transition-colors cursor-pointer text-center"
            >
              👑 {t('loginAsAdmin')}
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center text-xs text-zinc-400">
          <span>{t('dontHaveAccount')} </span>
          <button
            onClick={() => onNavigate('register')}
            className="text-[#d4af37] font-semibold hover:underline cursor-pointer ml-1"
          >
            {t('register')} (18+)
          </button>
        </div>
      </div>
    </div>
  );
};
