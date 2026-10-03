import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { addReview, getProducts, getReviews, likeReview } from '../db/storage';
import { Product, Review } from '../types';
import { Star, ThumbsUp, MessageSquare, Check, X, ShieldAlert, Sparkles } from 'lucide-react';

interface ReviewsPageProps {
  onNavigate: (route: string) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Review form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [selectedDishId, setSelectedDishId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    async function load() {
      const [revs, prods] = await Promise.all([getReviews(), getProducts()]);
      setReviews(revs);
      setProducts(prods);
    }
    load();
  }, []);

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const distribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, count, percentage };
  });

  const handleLike = async (id: string) => {
    const updated = await likeReview(id);
    setReviews(prev => prev.map(r => (r.id === id ? updated : r)));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!text.trim()) return;

    setIsSubmitting(true);
    const dish = products.find(p => p.id === selectedDishId);
    const dishName = dish ? (dish.name[language] || dish.name.EN) : undefined;

    const newRev = await addReview({
      userId: user.id,
      userName: user.name,
      rating,
      text: text.trim(),
      dishId: selectedDishId || undefined,
      dishName,
      verifiedPurchase: true,
    });

    setReviews([newRev, ...reviews]);
    setIsSubmitting(false);
    setModalOpen(false);
    setText('');
    setSelectedDishId('');
    setRating(5);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header & Write Review Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-zinc-800">
        <div className="space-y-2">
          <span className="text-xs text-[#d4af37] font-semibold tracking-widest uppercase">
            GASTRONOMIC CRITIQUE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            {t('allReviewsTitle')}
          </h1>
        </div>

        <div>
          {isAuthenticated ? (
            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c378] text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('leaveReviewBtn')}</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="px-5 py-2.5 rounded-xl bg-[#171720] border border-zinc-700 text-zinc-300 hover:text-white text-xs font-medium cursor-pointer"
            >
              {t('reviewLoginPrompt')}
            </button>
          )}
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{t('reviewSuccess')}</span>
        </div>
      )}

      {/* Ratings Overview & Distribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8 rounded-2xl bg-[#111116] border border-[#d4af37]/20 items-center">
        {/* Left: Overall score */}
        <div className="md:col-span-4 text-center md:border-r border-zinc-800 md:pr-6">
          <span className="font-mono tabular-nums text-5xl sm:text-6xl font-bold text-gold-gradient">
            {averageRating}
          </span>
          <div className="flex items-center justify-center gap-1.5 my-2">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xs text-zinc-400">
            {t('averageRating')} · {totalReviews} {t('navReviews')}
          </p>
        </div>

        {/* Right: Distribution Bars */}
        <div className="md:col-span-8 space-y-2">
          {distribution.map(d => (
            <div key={d.stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 text-zinc-400 flex items-center gap-1">
                <span>{d.stars}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#d4af37] to-[#fef08a]"
                  style={{ width: `${d.percentage}%` }}
                />
              </div>
              <span className="font-mono tabular-nums text-zinc-500 w-10 text-right">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map(r => (
          <div
            key={r.id}
            className="p-6 rounded-2xl bg-[#111116] border border-zinc-800 hover:border-[#d4af37]/30 transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#191922] border border-[#d4af37]/40 flex items-center justify-center font-bold text-xs text-[#d4af37]">
                  {r.userName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">{r.userName}</h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
                    <span className="text-emerald-400">Verified Guest</span>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span>{r.date}</span>
                  </div>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            {/* Dish Reference */}
            {r.dishName && (
              <div className="inline-block px-2.5 py-1 rounded bg-[#181824] border border-zinc-800 text-[11px] text-[#d4af37] font-medium">
                Dish: {r.dishName}
              </div>
            )}

            {/* Review Text */}
            <p className="text-sm text-zinc-300 leading-relaxed italic">
              "{r.text}"
            </p>

            {/* Like Counter */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleLike(r.id)}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#d4af37] transition-colors cursor-pointer px-2.5 py-1 rounded-lg bg-[#16161e] border border-zinc-800"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="font-mono tabular-nums">{r.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#121217] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-white mb-1">
              {t('leaveReviewBtn')}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              {t('rateExperience')}
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-5 text-xs">
              {/* Star Selector */}
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-semibold">{t('rateExperience')} *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(starNum => (
                    <button
                      key={starNum}
                      type="button"
                      onMouseEnter={() => setHoverRating(starNum)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(starNum)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          (hoverRating || rating) >= starNum
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-mono text-base font-bold text-white">{rating} / 5</span>
                </div>
              </div>

              {/* Optional Dish Selection */}
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-semibold">{t('selectDishReviewed')}</label>
                <select
                  value={selectedDishId}
                  onChange={e => setSelectedDishId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171720] border border-zinc-800 text-white outline-none focus:border-[#d4af37] cursor-pointer"
                >
                  <option value="">-- General Restaurant Atmosphere / Overall --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name[language] || p.name.EN} ({p.categoryId})
                    </option>
                  ))}
                </select>
              </div>

              {/* Text */}
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-semibold">Your Impression *</label>
                <textarea
                  required
                  rows={4}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder={t('reviewPlaceholder')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171720] border border-zinc-800 text-white outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c378] text-black font-bold cursor-pointer"
                >
                  {isSubmitting ? '...' : t('submitReview')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
