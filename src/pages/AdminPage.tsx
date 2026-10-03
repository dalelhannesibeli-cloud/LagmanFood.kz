import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getOrders, getReservations, getReviews, getStoredUsers, updateOrderStatus, updateReservationStatus } from '../db/storage';
import { Order, OrderStatus, Reservation, ReservationStatus, Review, User } from '../types';
import { Shield, ShoppingBag, Calendar, Users, DollarSign, CheckCircle, Clock, XCircle, ArrowLeft } from 'lucide-react';

interface AdminPageProps {
  onNavigate: (route: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { user, isAdmin, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'users' | 'reviews'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function loadData() {
      const [ords, resvs, usrs, revs] = await Promise.all([
        getOrders(),
        getReservations(),
        getStoredUsers(),
        getReviews(),
      ]);
      setOrders(ords);
      setReservations(resvs);
      setUsers(usrs);
      setReviews(revs);
    }
    loadData();
  }, []);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <Shield className="w-12 h-12 text-[#d4af37] mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-white">Administrator Access Required</h2>
        <p className="text-xs text-zinc-400">
          This portal is reserved for Lagman Food managers. Please log in with admin credentials.
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="px-6 py-2.5 rounded-xl bg-[#d4af37] text-black font-semibold text-xs cursor-pointer"
        >
          {t('loginAsAdmin')}
        </button>
      </div>
    );
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    const updated = await getOrders();
    setOrders(updated);
  };

  const handleUpdateReservationStatus = async (resId: string, newStatus: ReservationStatus) => {
    await updateReservationStatus(resId, newStatus);
    const updated = await getReservations();
    setReservations(updated);
  };

  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);
  const activeBookingsCount = reservations.filter(r => r.status === 'Confirmed' || r.status === 'Pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <button
            onClick={() => onNavigate('profile')}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#d4af37]" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              {t('adminDashboardTitle')}
            </h1>
          </div>
        </div>

        <span className="text-xs font-mono text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30">
          MANAGER: {user?.name}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#121217] border border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">{t('totalRevenue')}</span>
          <p className="font-mono tabular-nums text-2xl font-bold text-gold-gradient">
            {totalRevenue.toLocaleString()} ₸
          </p>
          <span className="text-[11px] text-emerald-400">Paid orders</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121217] border border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">{t('totalOrders')}</span>
          <p className="font-mono tabular-nums text-2xl font-bold text-white">
            {orders.length}
          </p>
          <span className="text-[11px] text-zinc-400">All registered tickets</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121217] border border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-500 uppercase tracking-wider">{t('activeReservations')}</span>
          <p className="font-mono tabular-nums text-2xl font-bold text-[#d4af37]">
            {activeBookingsCount}
          </p>
          <span className="text-[11px] text-amber-400">Upcoming guests</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
            activeTab === 'orders' ? 'bg-[#d4af37] text-black' : 'bg-[#141419] text-zinc-400 hover:text-white'
          }`}
        >
          Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
            activeTab === 'reservations' ? 'bg-[#d4af37] text-black' : 'bg-[#141419] text-zinc-400 hover:text-white'
          }`}
        >
          Table Bookings ({reservations.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
            activeTab === 'users' ? 'bg-[#d4af37] text-black' : 'bg-[#141419] text-zinc-400 hover:text-white'
          }`}
        >
          Users ({users.length})
        </button>
      </div>

      {/* Orders Manager */}
      {activeTab === 'orders' && (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-[#111116]">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#171720] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Current Status</th>
                <th className="p-4">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-mono font-bold text-[#d4af37] whitespace-nowrap">
                    {o.orderNumber}
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-white">{o.customerName}</p>
                    <p className="text-zinc-500 text-[11px]">{o.phone}</p>
                  </td>
                  <td className="p-4 max-w-xs truncate">
                    {o.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                  </td>
                  <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                    {o.total.toLocaleString()} ₸
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="font-semibold">{o.status}</span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <select
                      value={o.status}
                      onChange={e => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#181822] border border-zinc-700 text-white text-xs outline-none focus:border-[#d4af37] cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reservations Manager */}
      {activeTab === 'reservations' && (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-[#111116]">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#171720] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="p-4">Ref #</th>
                <th className="p-4">Guest</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Guests & Area</th>
                <th className="p-4">Status</th>
                <th className="p-4">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {reservations.map(r => (
                <tr key={r.id} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-mono font-bold text-[#d4af37] whitespace-nowrap">
                    {r.reservationNumber}
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-white">{r.guestName}</p>
                    <p className="text-zinc-500 text-[11px]">{r.phone}</p>
                  </td>
                  <td className="p-4 font-semibold text-white whitespace-nowrap">
                    {r.date} @ {r.time}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {r.guestsCount} pers. · <span className="uppercase text-[#d4af37]">{r.seatingArea}</span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="font-semibold">{r.status}</span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <select
                      value={r.status}
                      onChange={e => handleUpdateReservationStatus(r.id, e.target.value as ReservationStatus)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#181822] border border-zinc-700 text-white text-xs outline-none focus:border-[#d4af37] cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Registered Users */}
      {activeTab === 'users' && (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-[#111116]">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#171720] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Age (18+)</th>
                <th className="p-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white whitespace-nowrap">
                    {u.name}
                  </td>
                  <td className="p-4 text-zinc-400">{u.email}</td>
                  <td className="p-4 text-zinc-400">{u.phone}</td>
                  <td className="p-4 font-mono">{u.age} y.o.</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      u.role === 'admin' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-zinc-800 text-zinc-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
