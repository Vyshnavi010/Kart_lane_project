import { RotateCcw, Star, X } from 'lucide-react';
import type { RefObject } from 'react';
import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from '../types/product.ts';
import { DualRangeSlider } from './DualRangeSlider.tsx';

interface FilterSidebarProps {
  selectedCategories: ProductCategory[];
  onToggleCategory: (category: ProductCategory) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  onResetAll: () => void;
  categoryCounts: Record<ProductCategory, number>;
  hasActiveFilters: boolean;
  onCloseMobile?: () => void;
  categorySectionRef?: RefObject<HTMLElement | null>;
}

const RATING_OPTIONS = [
  { value: 0, label: 'All Ratings', stars: 0 },
  { value: 1, label: '1 Star & Above', stars: 1 },
  { value: 2, label: '2 Stars & Above', stars: 2 },
  { value: 3, label: '3 Stars & Above', stars: 3 },
  { value: 4, label: '4 Stars & Above', stars: 4 },
  { value: 5, label: '5 Stars', stars: 5 },
] as const;

export function FilterSidebar({
  selectedCategories,
  onToggleCategory,
  minPrice,
  maxPrice,
  onPriceChange,
  minRating,
  onRatingChange,
  onResetAll,
  categoryCounts,
  hasActiveFilters,
  onCloseMobile,
  categorySectionRef,
}: FilterSidebarProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-6">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
        <h2 className="font-display text-base font-bold text-slate-900">
          Filters
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetAll}
            disabled={!hasActiveFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Reset All
          </button>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close filters"
              className="lg:hidden p-1.5 -mr-1.5 text-slate-500 hover:text-slate-900 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* A. Category Filter */}
      <section ref={categorySectionRef} aria-labelledby="filter-category-heading">
        <div className="flex items-center justify-between mb-3">
          <h3
            id="filter-category-heading"
            className="text-sm font-semibold text-slate-900"
          >
            Category
          </h3>
          {selectedCategories.length > 0 && (
            <span className="text-xs text-slate-500 tabular-nums">
              {selectedCategories.length} selected
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          {PRODUCT_CATEGORIES.map((category) => {
            const isChecked = selectedCategories.includes(category);
            const count = categoryCounts[category] ?? 0;

            return (
              <label
                key={category}
                className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                  isChecked
                    ? 'bg-slate-100 text-slate-900 font-medium'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleCategory(category)}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 accent-slate-900 cursor-pointer shrink-0"
                  />
                  <span className="truncate">{category}</span>
                </span>
                <span className="text-xs text-slate-400 tabular-nums ml-2 shrink-0">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* B. Price Range Filter */}
      <section aria-labelledby="filter-price-heading">
        <h3
          id="filter-price-heading"
          className="text-sm font-semibold text-slate-900 mb-3"
        >
          Price Range
        </h3>
        <DualRangeSlider
          min={0}
          max={100000}
          step={500}
          minValue={minPrice}
          maxValue={maxPrice}
          onChange={onPriceChange}
        />
      </section>

      <hr className="border-slate-200" />

      {/* C. Minimum Star Rating Filter */}
      <section aria-labelledby="filter-rating-heading">
        <h3
          id="filter-rating-heading"
          className="text-sm font-semibold text-slate-900 mb-3"
        >
          Customer Rating
        </h3>
        <div className="space-y-1.5" role="radiogroup" aria-labelledby="filter-rating-heading">
          {RATING_OPTIONS.map((option) => {
            const isSelected = minRating === option.value;

            return (
              <label
                key={option.value}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-slate-100 text-slate-900 font-medium'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="min-star-rating"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => onRatingChange(option.value)}
                  className="w-4 h-4 border-slate-300 text-slate-900 focus:ring-slate-900 accent-slate-900 cursor-pointer shrink-0"
                />
                {option.stars > 0 && (
                  <span
                    className="inline-flex items-center gap-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    {[1, 2, 3, 4, 5].map((starIndex) => (
                      <Star
                        key={starIndex}
                        className={`w-3.5 h-3.5 ${
                          starIndex <= option.stars
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-100 text-slate-300'
                        }`}
                      />
                    ))}
                  </span>
                )}
                <span className="truncate">{option.label}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* D. Reset Filters Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onResetAll}
          disabled={!hasActiveFilters}
          className="w-full py-2.5 px-4 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
}
