import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Product, Review } from '../types';
import { getProductById, getProducts, getReviews } from '../db/storage';
import { ProductCard } from '../components/ProductCard';
import {
  Star,
  Flame,
  Plus,
  Minus,
  Check,
  ArrowLeft,
  Clock,
  Scale,
  Zap,
  ShieldCheck,
  Utensils,
  Share2,
} from 'lucide-react';

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
  onSelectProduct: (id: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onBack,
  onSelectProduct,
}) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [dishReviews, setDishReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function load() {
      const p = await getProductById(productId);
      if (p) {
        setProduct(p);
        const allProds = await getProducts();
        const related = allProds
          .filter(item => item.id !== p.id && item.categoryId === p.categoryId)
          .slice(0, 3);
        setRelatedProducts(related);
        const revs = await getReviews(p.id);
        setDishReviews(revs);
      }
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    load();
  }, [productId]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-zinc-400">Loading delicacy details...</p>
      </div>
    );
  }

  const name = product.name[language] || product.name.EN;
  const description = product.description[language] || product.description.EN;
  const ingredients = product.ingredients[language] || product.ingredients.EN || [];

  const handleAddToCart = () => {
    addToCart(product, quantity, notes);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t('navMenu')}</span>
        </button>
      </div>

      {/* Main Contiguous Purchase Module (Desktop Split Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Product Image Gallery */}
        <div className="lg:col-span-7">
          <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/25 bg-[#0f0f13] shadow-2xl group">
            <img
              src={product.image}
              alt={name}
              referrerPolicy="no-referrer"
              className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              {product.isSignature && (
                <span className="px-3 py-1 rounded bg-[#d4af37] text-black text-xs font-bold tracking-wider uppercase">
                  CHEF SIGNATURE
                </span>
              )}
              {product.isPopular && (
                <span className="px-3 py-1 rounded bg-black/70 backdrop-blur-md border border-[#d4af37]/40 text-[#fef08a] text-xs font-semibold">
                  TOP RATED
                </span>
              )}
            </div>

            {/* Spice Meter */}
            {product.spicyLevel > 0 && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/70 backdrop-blur-md border border-rose-500/30 px-2.5 py-1 rounded">
                <span className="text-xs text-rose-300 font-medium">
                  {product.spicyLevel === 1
                    ? t('spicyMild')
                    : product.spicyLevel === 2
                    ? t('spicyMedium')
                    : t('spicyHot')}
                </span>
                {Array.from({ length: product.spicyLevel }).map((_, i) => (
                  <Flame key={i} className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Contiguous Purchase Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {/* Category & Rating (Zero-pill metadata) */}
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
              <span className="uppercase tracking-widest text-[#d4af37] font-semibold">
                {product.categoryId}
              </span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <div className="flex items-center gap-1 text-white">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-mono tabular-nums font-semibold">{product.rating.toFixed(2)}</span>
                <span className="text-zinc-500">({product.reviewsCount} {t('dishReviews')})</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {name}
            </h1>

            {/* Price with tabular numerals */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="font-mono tabular-nums text-3xl font-bold text-gold-gradient">
                {product.price.toLocaleString()} ₸
              </span>
              {product.originalPrice && (
                <span className="font-mono tabular-nums text-base text-zinc-500 line-through">
                  {product.originalPrice.toLocaleString()} ₸
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-300 leading-relaxed">
            {description}
          </p>

          {/* Metric Specifications (Portion, Calories, Prep time) */}
          <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-[#121216] border border-zinc-800 text-center">
            <div className="flex flex-col items-center">
              <Scale className="w-4 h-4 text-[#d4af37] mb-1" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{t('portion')}</span>
              <span className="font-mono tabular-nums text-xs font-semibold text-white mt-0.5">
                {product.portionGrams} g
              </span>
            </div>
            <div className="flex flex-col items-center border-x border-zinc-800">
              <Zap className="w-4 h-4 text-[#d4af37] mb-1" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{t('calories')}</span>
              <span className="font-mono tabular-nums text-xs font-semibold text-white mt-0.5">
                {product.calories} kcal
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-4 h-4 text-[#d4af37] mb-1" />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{t('prepTime')}</span>
              <span className="font-mono tabular-nums text-xs font-semibold text-white mt-0.5">
                {product.prepTimeMinutes} min
              </span>
            </div>
          </div>

          {/* Ingredients Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{t('ingredients')}</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {ingredients.map((ing, i) => (
                <span
                  key={i}
                  className="text-xs bg-[#17171d] text-zinc-300 px-2.5 py-1 rounded border border-zinc-800"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Allergens Notice if applicable */}
          {product.allergens.length > 0 && (
            <div className="text-xs text-zinc-400">
              <span className="text-amber-500 font-medium">{t('allergensLabel')}: </span>
              <span>{product.allergens.join(', ')}</span>
            </div>
          )}

          {/* Custom Cooking Notes / Chef Comment */}
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400">
              {language === 'KZ'
                ? 'Аспазға ескертпе (мысалы: көкөніссіз, ащы тұздық бөлек)'
                : language === 'RU'
                ? 'Пожелание кухне (например: без лука, соус отдельно)'
                : 'Special dietary instruction for the chef'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="..."
              className="w-full text-xs px-3 py-2 rounded-lg bg-[#121216] border border-zinc-800 text-white placeholder-zinc-600 outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Purchase Controls: Stepper + Add to Cart */}
          <div className="flex items-center gap-3 pt-2">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-[#14141a] border border-zinc-800 rounded-xl p-1">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-mono tabular-nums text-sm font-bold text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Primary Buy CTA */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                addedAnimation
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#d4af37] hover:bg-[#e5c378] text-black shadow-[0_4px_20px_rgba(212,175,55,0.3)]'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{t('addedToCart')}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>{t('addToCart')} · {(product.price * quantity).toLocaleString()} ₸</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dish Reviews Section */}
      {dishReviews.length > 0 && (
        <div className="border-t border-zinc-800/80 pt-12 space-y-6">
          <h3 className="font-serif text-2xl font-bold text-white">
            {t('dishReviews')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dishReviews.map(r => (
              <div key={r.id} className="p-4 rounded-xl bg-[#121216] border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-xs text-white">{r.userName}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{r.text}</p>
                <span className="text-[10px] text-zinc-500 block mt-2">{r.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Dishes */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-zinc-800/80 pt-12 space-y-6">
          <h3 className="font-serif text-2xl font-bold text-white">
            {t('relatedDishes')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(rp => (
              <ProductCard
                key={rp.id}
                product={rp}
                onSelect={p => onSelectProduct(p.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
