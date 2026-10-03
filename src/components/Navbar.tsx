import React, { useState } from 'react';
import { LFLogo } from './LFLogo';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, User as UserIcon, Menu as MenuIcon, X, Shield } from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const { totalCount } = useCart();
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t('navHome') },
    { id: 'menu', label: t('navMenu') },
    { id: 'reservations', label: t('navReservations') },
    { id: 'reviews', label: t('navReviews') },
    { id: 'about', label: t('navAbout') },
    { id: 'contact', label: t('navContact') },
  ];

  const handleNavClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'KZ', label: 'ҚАЗ' },
    { code: 'RU', label: 'РУС' },
    { code: 'EN', label: 'ENG' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080809]/90 backdrop-blur-md border-b border-[#d4af37]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Brand */}
        <div onClick={() => handleNavClick('home')} className="shrink-0">
          <LFLogo size="md" />
        </div>

        {/* Zone 2: 4-6 Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map(link => {
            const isActive = currentRoute === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-sm tracking-wide transition-all duration-200 relative py-1 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-[#d4af37] font-medium'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Language Switcher, Cart, Profile/Auth) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language Switcher */}
          <div className="flex items-center bg-[#141418] border border-zinc-800 rounded-md p-0.5">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-2 py-1 text-xs font-medium rounded transition-all cursor-pointer ${
                  language === lang.code
                    ? 'bg-[#d4af37] text-black font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title={`Switch language to ${lang.label}`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Cart Trigger */}
          <button
            onClick={() => handleNavClick('cart')}
            className="relative p-2.5 rounded-lg bg-[#141418] border border-zinc-800 hover:border-[#d4af37]/40 text-zinc-300 hover:text-[#d4af37] transition-all cursor-pointer flex items-center justify-center"
            aria-label={t('navCart')}
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4af37] text-black text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                {totalCount}
              </span>
            )}
          </button>

          {/* User Account / Profile */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-2 px-3 rounded-lg bg-[#141418] border border-zinc-800 hover:border-[#d4af37]/40 text-zinc-200 transition-all cursor-pointer text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center text-xs font-bold">
                  {user?.name.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline font-medium max-w-[100px] truncate">
                  {user?.name}
                </span>
                {isAdmin && <Shield className="w-3.5 h-3.5 text-[#d4af37]" />}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#121216] border border-[#d4af37]/20 shadow-2xl py-2 z-50 animate-fade-in backdrop-blur-xl">
                  <div className="px-4 py-2 border-b border-zinc-800/80">
                    <p className="text-xs font-medium text-white truncate">{user?.name}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] text-[#d4af37] tracking-wider uppercase font-semibold">
                      {isAdmin ? 'ADMINISTRATOR' : 'VERIFIED 18+'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleNavClick('profile')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-[#1a1a22] hover:text-[#d4af37] transition-colors cursor-pointer"
                  >
                    {t('navProfile')}
                  </button>

                  <button
                    onClick={() => handleNavClick('orders')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-[#1a1a22] hover:text-[#d4af37] transition-colors cursor-pointer"
                  >
                    {t('navOrders')}
                  </button>

                  <button
                    onClick={() => handleNavClick('reservations')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-[#1a1a22] hover:text-[#d4af37] transition-colors cursor-pointer"
                  >
                    {t('tabReservations')}
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => handleNavClick('admin')}
                      className="w-full text-left px-4 py-2 text-xs text-[#d4af37] hover:bg-[#1a1a22] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      {t('navAdmin')}
                    </button>
                  )}

                  <div className="border-t border-zinc-800/80 my-1" />

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                      onNavigate('home');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-[#1a1a22] transition-colors cursor-pointer"
                  >
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('login')}
                className="px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-[#141418] border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all cursor-pointer whitespace-nowrap"
              >
                {t('login')}
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold text-black bg-[#d4af37] hover:bg-[#e5c378] rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-[0_0_12px_rgba(212,175,55,0.25)]"
              >
                {t('register')}
              </button>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#141418] border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0c0e] border-b border-[#d4af37]/20 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentRoute === link.id
                  ? 'bg-[#1a1a20] text-[#d4af37]'
                  : 'text-zinc-300 hover:bg-[#141418] hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          {!isAuthenticated && (
            <button
              onClick={() => handleNavClick('register')}
              className="block w-full text-center px-4 py-2 mt-3 rounded-lg bg-[#d4af37] text-black font-semibold text-sm"
            >
              {t('register')} (18+)
            </button>
          )}
        </div>
      )}
    </header>
  );
};
