import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../db/storage';
import { Order } from '../types';
import { SuccessModal } from '../components/SuccessModal';
import {
  ShieldAlert,
  Truck,
  Store,
  CreditCard,
  Banknote,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (route: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();

  // Form State
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<'card_courier' | 'cash' | 'online'>('card_courier');
  const [comment, setComment] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Success Modal
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  if (items.length === 0 && !successOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-zinc-400 mb-4">{t('emptyCartTitle')}</p>
        <button
          onClick={() => onNavigate('menu')}
          className="px-6 py-2.5 rounded-lg bg-[#d4af37] text-black font-semibold text-xs"
        >
          {t('viewMenuBtn')}
        </button>
      </div>
    );
  }

  const effectiveDeliveryFee = deliveryType === 'pickup' ? 0 : deliveryFee;
  const effectiveTotal = subtotal + effectiveDeliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg(language === 'KZ' ? 'Аты-жөніңізді енгізіңіз' : 'Пожалуйста, введите ваше имя');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg(language === 'KZ' ? 'Телефон нөмірін енгізіңіз' : 'Пожалуйста, укажите номер телефона');
      return;
    }
    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMsg(language === 'KZ' ? 'Жеткізу мекенжайын енгізіңіз' : 'Укажите адрес доставки');
      return;
    }
    if (!ageConfirmed) {
      setErrorMsg(t('ageRequiredError'));
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = items.map(it => ({
        productId: it.product.id,
        name: it.product.name[language] || it.product.name.EN,
        price: it.product.price,
        quantity: it.quantity,
        image: it.product.image,
      }));

      const newOrder = await createOrder({
        userId: user?.id || 'guest-anon',
        customerName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        deliveryType,
        deliveryAddress: deliveryType === 'pickup' ? 'Lagman Food, Dostyk Ave 105, Almaty' : deliveryAddress.trim(),
        paymentMethod,
        comment: comment.trim(),
        items: orderItems,
        subtotal,
        deliveryFee: effectiveDeliveryFee,
        total: effectiveTotal,
        estimatedDeliveryTime: deliveryType === 'pickup' ? '25-30 min' : '45-60 min',
      });

      clearCart();
      setSuccessOrder(newOrder);
    } catch {
      setErrorMsg('Failed to process order. Please check inputs and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-zinc-800">
        <span className="text-xs text-[#d4af37] font-semibold tracking-wider uppercase">
          {t('checkoutTitle')}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          {t('checkoutTitle')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Checkout Form */}
        <div className="lg:col-span-8 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Fulfillment Method Segmented Selector */}
          <div className="p-5 rounded-2xl bg-[#121216] border border-zinc-800 space-y-4">
            <h3 className="font-serif text-base font-bold text-white">
              1. {t('deliveryMethod')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  deliveryType === 'delivery'
                    ? 'border-[#d4af37] bg-[#d4af37]/10 text-white'
                    : 'border-zinc-800 bg-[#16161d] text-zinc-400 hover:text-white'
                }`}
              >
                <Truck className="w-4 h-4 text-[#d4af37]" />
                <span>{t('courierDelivery')}</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  deliveryType === 'pickup'
                    ? 'border-[#d4af37] bg-[#d4af37]/10 text-white'
                    : 'border-zinc-800 bg-[#16161d] text-zinc-400 hover:text-white'
                }`}
              >
                <Store className="w-4 h-4 text-[#d4af37]" />
                <span>{t('selfPickup')}</span>
              </button>
            </div>

            {deliveryType === 'pickup' && (
              <p className="text-xs text-amber-400/90 bg-amber-400/10 p-3 rounded-lg border border-amber-400/20">
                {t('pickupAddressNote')}
              </p>
            )}
          </div>

          {/* 2. Customer Information */}
          <div className="p-5 rounded-2xl bg-[#121216] border border-zinc-800 space-y-4">
            <h3 className="font-serif text-base font-bold text-white">
              2. {t('customerInfo')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400">{t('fullName')} *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Сұлтан Берікұлы"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181820] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181820] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-zinc-400">{t('email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181820] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
                />
              </div>

              {deliveryType === 'delivery' && (
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-zinc-400">{t('deliveryAddress')} *</label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    placeholder="Алматы қ., Әл-Фараби даңғылы 77, 42-пәтер"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#181820] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
                  />
                </div>
              )}

              <div className="sm:col-span-2 space-y-1">
                <label className="text-zinc-400">{t('orderComment')}</label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#181820] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="p-5 rounded-2xl bg-[#121216] border border-zinc-800 space-y-4">
            <h3 className="font-serif text-base font-bold text-white">
              3. {t('paymentMethod')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-3.5 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all ${
                  paymentMethod === 'card_courier'
                    ? 'border-[#d4af37] bg-[#d4af37]/10 text-white'
                    : 'border-zinc-800 bg-[#16161d] text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card_courier'}
                    onChange={() => setPaymentMethod('card_courier')}
                    className="accent-[#d4af37]"
                  />
                  <CreditCard className="w-4 h-4 text-[#d4af37]" />
                </div>
                <span className="text-xs font-semibold mt-1">{t('payCardCourier')}</span>
              </label>

              <label
                className={`p-3.5 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-[#d4af37] bg-[#d4af37]/10 text-white'
                    : 'border-zinc-800 bg-[#16161d] text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="accent-[#d4af37]"
                  />
                  <Banknote className="w-4 h-4 text-[#d4af37]" />
                </div>
                <span className="text-xs font-semibold mt-1">{t('payCash')}</span>
              </label>

              <label
                className={`p-3.5 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all ${
                  paymentMethod === 'online'
                    ? 'border-[#d4af37] bg-[#d4af37]/10 text-white'
                    : 'border-zinc-800 bg-[#16161d] text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="accent-[#d4af37]"
                  />
                  <Lock className="w-4 h-4 text-[#d4af37]" />
                </div>
                <span className="text-xs font-semibold mt-1">{t('payOnline')}</span>
              </label>
            </div>
          </div>

          {/* 4. Mandatory 18+ Age Confirmation Checkbox */}
          <div className="p-4 rounded-xl bg-[#171410] border border-amber-500/30 flex items-start gap-3">
            <input
              type="checkbox"
              id="ageConfirm"
              checked={ageConfirmed}
              onChange={e => setAgeConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#d4af37] cursor-pointer"
            />
            <label htmlFor="ageConfirm" className="text-xs text-amber-200/90 leading-relaxed cursor-pointer select-none">
              <span className="font-semibold">{t('ageConfirmation18')}</span>. {t('authAgeNotice')}
            </label>
          </div>
        </div>

        {/* Right: Order Summary Breakdown & Place Order Button */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#121216] border border-[#d4af37]/30 space-y-5 sticky top-24">
          <h2 className="font-serif text-lg font-bold text-white">
            {language === 'KZ' ? 'Тапсырыс құрамы' : language === 'RU' ? 'Состав заказа' : 'Order Items'}
          </h2>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {items.map(it => (
              <div key={it.product.id} className="flex justify-between items-center text-xs">
                <span className="text-zinc-300 truncate max-w-[190px]">
                  {it.quantity}x {it.product.name[language] || it.product.name.EN}
                </span>
                <span className="font-mono tabular-nums text-white">
                  {(it.product.price * it.quantity).toLocaleString()} ₸
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 space-y-2 text-xs text-zinc-400">
            <div className="flex justify-between">
              <span>{t('subtotal')}</span>
              <span className="font-mono tabular-nums text-white">{subtotal.toLocaleString()} ₸</span>
            </div>
            <div className="flex justify-between">
              <span>{t('deliveryFee')}</span>
              <span className="font-mono tabular-nums text-white">
                {effectiveDeliveryFee === 0 ? t('deliveryFree') : `${effectiveDeliveryFee.toLocaleString()} ₸`}
              </span>
            </div>
            <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline text-sm">
              <span className="font-bold text-white">{t('total')}</span>
              <span className="font-mono tabular-nums text-2xl font-bold text-gold-gradient">
                {effectiveTotal.toLocaleString()} ₸
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-4 rounded-xl bg-[#d4af37] hover:bg-[#e5c378] disabled:opacity-50 text-black font-bold text-sm tracking-wide transition-all shadow-[0_4px_25px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span>{language === 'KZ' ? 'Өңделуде...' : 'Обработка...'}</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t('placeOrderBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {successOrder && (
        <SuccessModal
          isOpen={true}
          type="order"
          referenceNumber={successOrder.orderNumber}
          details={`Total: ${successOrder.total.toLocaleString()} ₸ · Est: ${successOrder.estimatedDeliveryTime}`}
          onClose={() => {
            setSuccessOrder(null);
            onNavigate('menu');
          }}
          onViewAction={() => {
            setSuccessOrder(null);
            onNavigate('orders');
          }}
        />
      )}
    </div>
  );
};
