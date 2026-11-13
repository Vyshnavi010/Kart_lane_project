import { ArrowUpDown, Search, SlidersHorizontal, X } from 'lucide-react';
import type {
  Product,
  ProductCategory,
  SortOption,
} from '../types/product.ts';
import { formatINR } from '../utils/formatters.ts';
import { ProductCard } from './ProductCard.tsx';

interface ProductGridProps {
  products: Product[];
  totalCount: number;
  isLoading: boolean;
  errorMessage: string | null;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedCategories: ProductCategory[];
  onRemoveCategory: (category: ProductCategory) => void;
  minPrice: number;
  maxPrice: number;
  onResetPrice: () => void;
  minRating: number;
  onResetRating: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onResetAll: () => void;
  onOpenMobileFilters: () => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  activeFilterCount: number;
}

export function ProductGrid({
  products,
  totalCount,
  isLoading,
  errorMessage,
  sortBy,
  onSortChange,
  selectedCategories,
  onRemoveCategory,
  minPrice,
  maxPrice,
  onResetPrice,
  minRating,
  onResetRating,
  searchQuery,
  onSearchChange,
  onResetAll,
  onOpenMobileFilters,
  onAddToCart,
  onSelectProduct,
  activeFilterCount,
}: ProductGridProps) {
  const hasPriceFilter = minPrice > 0 || maxPrice < 100000;
  const hasSearchFilter = searchQuery.trim().length > 0;
  const hasAnyChip =
    selectedCategories.length > 0 ||
    hasPriceFilter ||
    minRating > 0 ||
    hasSearchFilter;

  return (
    <div className="flex-1 min-w-0">
      {/* Mobile Search Bar (keeps mobile sticky header compact) */}
      <div className="sm:hidden mb-4 relative">
        <Search
          className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          aria-label="Search products"
          className="w-full h-11 pl-10 pr-9 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Inventory Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded bg-slate-900 text-white text-xs font-bold tabular-nums">
                {activeFilterCount}
              </span>
            )}
          </button>

          <p className="text-sm text-slate-600 tabular-nums">
            Showing{' '}
            <span className="font-semibold text-slate-900">
              {products.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-900">{totalCount}</span>{' '}
            products
          </p>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2.5">
          <label
            htmlFor="sort-by-select"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 whitespace-nowrap"
          >
            <ArrowUpDown className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span>Sort By:</span>
          </label>
          <select
            id="sort-by-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="h-9 pl-3 pr-8 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Top Rated First</option>
          </select>
        </div>
      </div>

      {/* Active Filter Controls */}
      {hasAnyChip && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {selectedCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onRemoveCategory(category)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 hover:border-slate-400 transition-colors cursor-pointer"
            >
              <span>{category}</span>
              <X className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            </button>
          ))}

          {hasPriceFilter && (
            <button
              type="button"
              onClick={onResetPrice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 hover:border-slate-400 transition-colors cursor-pointer tabular-nums"
            >
              <span>
                {formatINR(minPrice)} – {formatINR(maxPrice)}
              </span>
              <X className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            </button>
          )}

          {minRating > 0 && (
            <button
              type="button"
              onClick={onResetRating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 hover:border-slate-400 transition-colors cursor-pointer"
            >
              <span>
                {minRating === 5 ? '5 Stars' : `${minRating} Stars & Above`}
              </span>
              <X className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            </button>
          )}

          {hasSearchFilter && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 hover:border-slate-400 transition-colors cursor-pointer"
            >
              <span>Search: &ldquo;{searchQuery.trim()}&rdquo;</span>
              <X className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            onClick={onResetAll}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-4 px-2 py-1 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Error State */}
      {errorMessage && (
        <div
          role="alert"
          className="mt-5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm flex items-center justify-between gap-4"
        >
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={onResetAll}
            className="px-3 py-1.5 rounded-lg bg-rose-900 text-white text-xs font-medium hover:bg-rose-800 cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Initial Loading Skeletons */}
      {isLoading && products.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] bg-slate-200" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-24 bg-slate-200 rounded" />
                <div className="h-4 w-full bg-slate-200 rounded" />
                <div className="h-4 w-2/3 bg-slate-200 rounded" />
                <div className="h-5 w-20 bg-slate-200 rounded mt-4" />
                <div className="h-10 w-full bg-slate-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty Results State */
        <div className="mt-5 bg-white border border-slate-200 rounded-xl p-12 text-center">
          <h3 className="font-display text-lg font-bold text-slate-900">
            No matching products found
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            Try widening your INR price range, lowering the minimum star rating,
            or clearing selected categories.
          </p>
          <button
            type="button"
            onClick={onResetAll}
            className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        /* Product Inventory Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}
