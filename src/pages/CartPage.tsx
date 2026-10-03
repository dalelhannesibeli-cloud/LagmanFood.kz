import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, UtensilsCrossed, Sparkles } from 'lucide-react';

interface CartPageProps {
  onNavigate: (route: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, deliveryFee, total, totalCount } =
    useCart();

  const freeDeliveryThreshold = 10000;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#14141a] border border-[#d4af37]/30 flex items-center justify-center mx-auto text-[#d4af37]">
          <ShoppingBag className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-white">
            {t('emptyCartTitle')}
          </h2>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            {t('emptyCartDesc')}
          </p>
        </div>
        <button
          onClick={() => onNavigate('menu')}
          className="px-6 py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c378] text-black font-semibold text-sm transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>{t('viewMenuBtn')}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            {t('cartTitle')}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {totalCount} {language === 'KZ' ? 'тағам таңдалды' : language === 'RU' ? 'позиций в заказе' : 'items selected'}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
        >
          {t('clearCart')}
        </button>
      </div>

      {/* Free Delivery Progress Bar */}
      <div className="p-4 rounded-xl bg-[#121217] border border-[#d4af37]/20 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            {remainingForFreeDelivery === 0 ? (
              <span className="text-[#fef08a] font-semibold">{t('deliveryFree')}</span>
            ) : (
              <span>
                {language === 'KZ'
                  ? `Тегін жеткізу үшін тағы ${remainingForFreeDelivery.toLocaleString()} ₸ сомаға тапсырыс беріңіз`
                  : language === 'RU'
                  ? `Добавьте блюд еще на ${remainingForFreeDelivery.toLocaleString()} ₸ для бесплатной доставки`
                  : `Add ${remainingForFreeDelivery.toLocaleString()} ₸ more for free express delivery`}
              </span>
            )}
          </span>
          <span className="font-mono text-zinc-400">{freeDeliveryPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#d4af37] to-[#fef08a] transition-all duration-500"
            style={{ width: `${freeDeliveryPercent}%` }}
          />
        </div>
      </div>

      {/* Main Cart Grid: Item List (Left) + Order Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(item => {
            const name = item.product.name[language] || item.product.name.EN;
            return (
              <div
                key={item.product.id}
                className="p-4 rounded-xl bg-[#121216] border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Thumbnail & Title */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={item.product.image}
                    alt={name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover bg-zinc-900 shrink-0 border border-zinc-800"
                  />
                  <div>
                    <h3 className="font-serif text-base font-semibold text-white">
                      {name}
                    </h3>
                    <p className="font-mono tabular-nums text-sm text-[#d4af37] font-bold mt-0.5">
                      {item.product.price.toLocaleString()} ₸
                    </p>
                    {item.comment && (
                      <p className="text-[11px] text-zinc-400 italic mt-1 line-clamp-1">
                        Note: {item.comment}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stepper + Total + Delete */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5">
                  <div className="flex items-center bg-[#17171e] border border-zinc-700/80 rounded-lg p-0.5">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="w-7 h-7 rounded flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-mono tabular-nums text-xs font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="w-7 h-7 rounded flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                      aria-label="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-mono tabular-nums text-sm font-bold text-white min-w-[75px] text-right">
                    {(item.product.price * item.quantity).toLocaleString()} ₸
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Panel */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#121216] border border-[#d4af37]/25 space-y-5 sticky top-24">
          <h2 className="font-serif text-xl font-bold text-white">
            {language === 'KZ' ? 'Тапсырыс сомасы' : language === 'RU' ? 'Итог заказа' : 'Order Summary'}
          </h2>

          <div className="space-y-3 text-xs text-zinc-300">
            <div className="flex justify-between">
              <span>{t('subtotal')}</span>
              <span className="font-mono tabular-nums font-semibold text-white">
                {subtotal.toLocaleString()} ₸
              </span>
            </div>

            <div className="flex justify-between">
              <span>{t('deliveryFee')}</span>
              <span className="font-mono tabular-nums font-semibold text-white">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-400 font-semibold">{t('deliveryFree')}</span>
                ) : (
                  `${deliveryFee.toLocaleString()} ₸`
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline text-sm">
              <span className="font-semibold text-white">{t('total')}</span>
              <span className="font-mono tabular-nums text-2xl font-bold text-gold-gradient">
                {total.toLocaleString()} ₸
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('checkout')}
            className="w-full py-3.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#e5c378] text-black font-bold text-sm tracking-wide transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t('proceedToCheckout')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
