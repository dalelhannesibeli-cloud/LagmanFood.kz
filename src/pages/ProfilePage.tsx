import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getOrders, getReservations, getReviews, updateOrderStatus, updateReservationStatus } from '../db/storage';
import { Order, Reservation, Review } from '../types';
import {
  User as UserIcon,
  ShoppingBag,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Edit2,
  Trash2,
  Star,
} from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (route: string) => void;
  initialTab?: 'profile' | 'orders' | 'reservations' | 'reviews';
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, initialTab = 'orders' }) => {
  const { language, t } = useLanguage();
  const { user, updateUser, logout, isAdmin, isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'reservations' | 'reviews'>(initialTab);

  // Profile Form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Data lists
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate('login');
      return;
    }

    async function loadData() {
      if (user) {
        setName(user.name);
        setPhone(user.phone);
        setAddress(user.address || '');

        const [ords, resvs, allRevs] = await Promise.all([
          getOrders(user.id),
          getReservations(user.id),
          getReviews(),
        ]);
        setOrders(ords);
        setReservations(resvs);
        setUserReviews(allRevs.filter(r => r.userId === user.id));
      }
    }
    loadData();
  }, [user, isAuthenticated, onNavigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await updateUser({ name: name.trim(), phone: phone.trim(), address: address.trim() });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      await updateOrderStatus(orderId, 'Cancelled');
      const updated = await getOrders(user?.id);
      setOrders(updated);
      if (selectedOrderDetails?.id === orderId) {
        setSelectedOrderDetails(null);
      }
    }
  };

  const handleCancelReservation = async (resId: string) => {
    if (confirm('Are you sure you want to cancel this table booking?')) {
      await updateReservationStatus(resId, 'Cancelled');
      const updated = await getReservations(user?.id);
      setReservations(updated);
    }
  };

  const getStatusBadge = (status: Order['status'] | Reservation['status']) => {
    switch (status) {
      case 'Confirmed':
      case 'Ready':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            {t(`status${status}` as any) || status}
          </span>
        );
      case 'Preparing':
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            {t(`status${status}` as any) || status}
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
            {t('statusCompleted')}
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            {t('statusCancelled')}
          </span>
        );
      default:
        return <span className="text-zinc-400 text-xs">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#111116] border border-[#d4af37]/25 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#191712] to-[#2b2416] border-2 border-[#d4af37] flex items-center justify-center text-lg font-serif font-bold text-[#d4af37]">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-white">{user?.name}</h1>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold tracking-wider uppercase">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400">{user?.email} · {user?.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className="px-4 py-2 rounded-xl bg-[#d4af37] text-black font-semibold text-xs flex items-center gap-1.5 shadow-md hover:bg-[#e5c378] cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>{t('tabAdminPanel')}</span>
            </button>
          )}

          <button
            onClick={() => {
              logout();
              onNavigate('home');
            }}
            className="px-3.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-rose-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#141419] text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t('tabOrders')}</span>
          <span className="ml-1 opacity-70">({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'reservations'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#141419] text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t('tabReservations')}</span>
          <span className="ml-1 opacity-70">({reservations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#141419] text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>{t('tabProfile')}</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#141419] text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t('tabReviews')}</span>
          <span className="ml-1 opacity-70">({userReviews.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-[#101014] rounded-2xl border border-zinc-800">
              <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="font-serif text-lg text-white font-semibold">{t('noOrdersYet')}</p>
              <button
                onClick={() => onNavigate('menu')}
                className="mt-4 px-5 py-2.5 bg-[#d4af37] text-black font-semibold text-xs rounded-xl cursor-pointer"
              >
                {t('viewMenuBtn')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-[#121217] border border-zinc-800 hover:border-[#d4af37]/30 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-[#d4af37]">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="text-xs text-zinc-400 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs bg-[#171720] p-2.5 rounded-xl border border-zinc-800/60">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-10 h-10 rounded-lg object-cover bg-zinc-900"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">{it.name}</p>
                          <p className="text-zinc-400 font-mono text-[11px]">
                            {it.quantity}x {it.price.toLocaleString()} ₸
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom bar */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="text-zinc-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span className="truncate max-w-xs">{order.deliveryAddress}</span>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 uppercase block">{t('total')}</span>
                        <span className="font-mono tabular-nums text-base font-bold text-white">
                          {order.total.toLocaleString()} ₸
                        </span>
                      </div>

                      {order.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                        >
                          {t('cancelOrder')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Reservations */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="text-center py-20 bg-[#101014] rounded-2xl border border-zinc-800">
              <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="font-serif text-lg text-white font-semibold">{t('noReservationsYet')}</p>
              <button
                onClick={() => onNavigate('reservations')}
                className="mt-4 px-5 py-2.5 bg-[#d4af37] text-black font-semibold text-xs rounded-xl cursor-pointer"
              >
                {t('reserveTableBtn')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reservations.map(res => (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl bg-[#121217] border border-zinc-800 space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <span className="font-mono text-sm font-bold text-[#d4af37]">
                      {res.reservationNumber}
                    </span>
                    {getStatusBadge(res.status)}
                  </div>

                  <div className="space-y-2 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#d4af37]" />
                      <span className="font-semibold text-white">{res.date}</span>
                      <span>at</span>
                      <span className="font-semibold text-white">{res.time}</span>
                    </div>

                    <div className="text-zinc-400">
                      <span>Guests: </span>
                      <span className="text-white font-semibold">{res.guestsCount} Persons</span>
                      <span className="mx-2">·</span>
                      <span className="uppercase text-[#d4af37]">{res.seatingArea}</span>
                    </div>

                    {res.comment && (
                      <p className="text-[11px] text-zinc-400 italic bg-[#171720] p-2 rounded-lg border border-zinc-800">
                        "{res.comment}"
                      </p>
                    )}
                  </div>

                  {res.status === 'Confirmed' || res.status === 'Pending' ? (
                    <div className="pt-2 border-t border-zinc-800 flex justify-end">
                      <button
                        onClick={() => handleCancelReservation(res.id)}
                        className="text-xs text-rose-400 hover:underline cursor-pointer"
                      >
                        {t('cancelReservation')}
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Personal Profile Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-[#121216] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-xl font-bold text-white">
            {t('tabProfile')}
          </h2>

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t('profileUpdated')}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-400">{t('fullName')}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171e] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">{t('phone')}</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171e] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">{t('deliveryAddress')}</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Almaty, Dostyk Ave 105"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171e] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#d4af37] text-black font-semibold text-xs hover:bg-[#e5c378] transition-colors cursor-pointer"
              >
                {t('saveChanges')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Reviews Written by User */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {userReviews.length === 0 ? (
            <div className="text-center py-20 bg-[#101014] rounded-2xl border border-zinc-800">
              <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="font-serif text-lg text-white font-semibold">{t('noReviewsYet')}</p>
              <button
                onClick={() => onNavigate('reviews')}
                className="mt-4 px-5 py-2.5 bg-[#d4af37] text-black font-semibold text-xs rounded-xl cursor-pointer"
              >
                {t('leaveReviewBtn')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userReviews.map(r => (
                <div key={r.id} className="p-5 rounded-2xl bg-[#121217] border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#d4af37]">{r.dishName || 'Lagman Food'}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 italic leading-relaxed">"{r.text}"</p>
                  <span className="text-[10px] text-zinc-500 block">{r.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
