import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Category, CategoryId, Product } from '../types';
import { getCategories, getProducts } from '../db/storage';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, Utensils, X } from 'lucide-react';

interface MenuPageProps {
  onSelectProduct: (productId: string) => void;
  initialCategory?: CategoryId | 'all';
}

export const MenuPage: React.FC<MenuPageProps> = ({ onSelectProduct, initialCategory = 'all' }) => {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'priceDesc' | 'rating'>('popular');

  useEffect(() => {
    async function load() {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    }
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category filter
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
          return false;
        }
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const name = (p.name[language] || p.name.EN).toLowerCase();
          const desc = (p.description[language] || p.description.EN).toLowerCase();
          const ingredients = (p.ingredients[language] || p.ingredients.EN || []).join(' ').toLowerCase();
          return name.includes(q) || desc.includes(q) || ingredients.includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // default: popular
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy, language]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <span className="text-xs text-[#d4af37] font-semibold tracking-widest uppercase">
          {t('tagline')}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          {t('navMenu')}
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl">
          {language === 'KZ'
            ? 'Шеф-аспазымыздың арнайы дайындаған дәстүрлі және заманауи авторлық тағамдары.'
            : language === 'RU'
            ? 'Аутентичные блюда шеф-повара: от традиционного гуйру лагмана до нежнейших десертов.'
            : 'Explore our master-pulled noodles, hand-pleated manti, rich shurpa, and artisan desserts.'}
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4 pt-2">
        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#121216] border border-zinc-800 focus:border-[#d4af37] text-sm text-white placeholder-zinc-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
            <span className="text-xs text-zinc-400 hidden sm:inline">{t('sortBy')}</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-[#121216] border border-zinc-800 text-xs text-zinc-200 py-2.5 px-3 rounded-xl outline-none focus:border-[#d4af37] cursor-pointer"
            >
              <option value="popular">{t('sortPopular')}</option>
              <option value="priceAsc">{t('sortPriceAsc')}</option>
              <option value="priceDesc">{t('sortPriceDesc')}</option>
              <option value="rating">{t('sortRating')}</option>
            </select>
          </div>
        </div>

        {/* Interactive Category Segmented Tabs (Clean buttons per skill constitution) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-800/80">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#d4af37] text-black shadow-[0_2px_12px_rgba(212,175,55,0.25)]'
                : 'bg-[#121216] text-zinc-400 hover:text-white hover:bg-[#1a1a20] border border-zinc-800'
            }`}
          >
            {t('allCategories')}
          </button>

          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            const catName = cat.name[language] || cat.name.EN;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#d4af37] text-black shadow-[0_2px_12px_rgba(212,175,55,0.25)]'
                    : 'bg-[#121216] text-zinc-400 hover:text-white hover:bg-[#1a1a20] border border-zinc-800'
                }`}
              >
                {catName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={p => onSelectProduct(p.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-[#101014] rounded-2xl border border-zinc-800/80">
          <Utensils className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="font-serif text-xl text-white font-semibold">
            {t('noDishesFound')}
          </p>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            {language === 'KZ'
              ? 'Басқа сұраныс енгізіп көріңіз немесе сүзгіні өшіріңіз.'
              : language === 'RU'
              ? 'Попробуйте изменить поисковый запрос или выбрать другую категорию.'
              : 'Try adjusting your search criteria or switching categories.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 bg-[#d4af37] text-black font-semibold text-xs rounded-lg cursor-pointer"
          >
            {t('allCategories')}
          </button>
        </div>
      )}
    </div>
  );
};
