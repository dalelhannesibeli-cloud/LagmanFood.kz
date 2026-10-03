import React, { useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Star, Flame, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const name = product.name[language] || product.name.EN;
  const description = product.description[language] || product.description.EN;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-[#101014] rounded-xl overflow-hidden border border-[#d4af37]/15 hover:border-[#d4af37]/45 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(212,175,55,0.18)] flex flex-col cursor-pointer"
    >
      {/* Image Container with 4:3 Aspect Ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
        <img
          src={product.image}
          alt={name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-transparent to-transparent opacity-80" />

        {/* Subtle status marks (Clean unboxed text) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-medium tracking-wide">
          {product.isSignature && (
            <span className="text-[#fef08a] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-[#d4af37]/30">
              SIGNATURE
            </span>
          )}
          {product.isPopular && (
            <span className="text-zinc-200 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-zinc-700/50">
              TOP RATED
            </span>
          )}
        </div>

        {/* Spicy Indicator */}
        {product.spicyLevel > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-rose-500/30">
            {Array.from({ length: product.spicyLevel }).map((_, i) => (
              <Flame key={i} className="w-3 h-3 text-rose-500 fill-rose-500" />
            ))}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row: Category & Rating (Zero-pill text separators) */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1.5">
            <span className="uppercase tracking-wider text-[11px] text-[#d4af37] font-medium">
              {product.categoryId}
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <div className="flex items-center gap-1 text-zinc-300">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-mono tabular-nums">{product.rating.toFixed(1)}</span>
              <span className="text-zinc-500">({product.reviewsCount})</span>
            </div>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="font-mono tabular-nums text-zinc-400">{product.portionGrams}g</span>
          </div>

          {/* Dish Name */}
          <h3 className="font-serif text-lg font-semibold text-white group-hover:text-[#fef08a] transition-colors line-clamp-1">
            {name}
          </h3>

          {/* Description */}
          <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono tabular-nums text-lg font-bold text-white">
              {product.price.toLocaleString()} ₸
            </span>
            {product.originalPrice && (
              <span className="font-mono tabular-nums text-xs text-zinc-500 line-through">
                {product.originalPrice.toLocaleString()} ₸
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              justAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-[#d4af37] hover:bg-[#e5c378] text-black shadow-[0_2px_10px_rgba(212,175,55,0.2)]'
            }`}
            title={t('addToCart')}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{t('addedToCart')}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{t('addToCart')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
