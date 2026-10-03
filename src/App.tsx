/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ReservationPage } from './pages/ReservationPage';
import { ProfilePage } from './pages/ProfilePage';
import { ReviewsPage } from './pages/ReviewsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { Check, ShoppingBag, ArrowRight } from 'lucide-react';

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('lf-01');
  const { recentAddedItem, clearRecentAdded } = useCart();
  const { language, t } = useLanguage();

  // Hash-based navigation synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      if (hash.startsWith('product-')) {
        const prodId = hash.replace('product-', '');
        setSelectedProductId(prodId);
        setCurrentRoute('product');
      } else {
        setCurrentRoute(hash);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string, productId?: string) => {
    if (route === 'product' && productId) {
      setSelectedProductId(productId);
      window.location.hash = `product-${productId}`;
    } else {
      window.location.hash = route;
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'menu':
        return (
          <MenuPage
            onSelectProduct={id => navigateTo('product', id)}
          />
        );
      case 'product':
        return (
          <ProductDetailPage
            productId={selectedProductId}
            onBack={() => navigateTo('menu')}
            onSelectProduct={id => navigateTo('product', id)}
          />
        );
      case 'cart':
        return <CartPage onNavigate={navigateTo} />;
      case 'checkout':
        return <CheckoutPage onNavigate={navigateTo} />;
      case 'reservations':
        return <ReservationPage onNavigate={navigateTo} />;
      case 'reservations-list':
        return <ProfilePage onNavigate={navigateTo} initialTab="reservations" />;
      case 'orders':
        return <ProfilePage onNavigate={navigateTo} initialTab="orders" />;
      case 'profile':
        return <ProfilePage onNavigate={navigateTo} initialTab="profile" />;
      case 'reviews':
        return <ReviewsPage onNavigate={navigateTo} />;
      case 'about':
        return <AboutPage onNavigate={navigateTo} />;
      case 'contact':
        return <ContactPage onNavigate={navigateTo} />;
      case 'login':
        return <LoginPage onNavigate={navigateTo} />;
      case 'register':
        return <RegisterPage onNavigate={navigateTo} />;
      case 'admin':
        return <AdminPage onNavigate={navigateTo} />;
      default:
        return <NotFoundPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080809] text-zinc-100 selection:bg-[#d4af37]/30 selection:text-white">
      {/* Top Bar Contract Navigation */}
      <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Global Added to Cart Toast */}
      {recentAddedItem && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-500 bg-[#121217] border border-[#d4af37]/50 rounded-2xl p-4 shadow-[0_10px_35px_rgba(212,175,55,0.25)] flex items-center gap-3 backdrop-blur-xl max-w-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {recentAddedItem.name[language] || recentAddedItem.name.EN}
            </p>
            <p className="text-[11px] text-zinc-400">{t('addedToCart')}</p>
          </div>
          <button
            onClick={() => {
              clearRecentAdded();
              navigateTo('cart');
            }}
            className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-black text-xs font-bold shrink-0 hover:bg-[#e5c378] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>{t('navCart')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Luxury Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
