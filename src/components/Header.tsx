import { Search, ShoppingBag, X } from 'lucide-react';
import type { FormEvent } from 'react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onNavigateHome: () => void;
  onNavigateProducts: () => void;
  onNavigateCategories: () => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onNavigateHome,
  onNavigateProducts,
  onNavigateCategories,
}: HeaderProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNavigateProducts();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome();
          }}
          className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 rounded"
        >
          KARTLANE
        </a>

        {/* Zone 2: Navigation Links + Search */}
        <div className="flex items-center gap-6 lg:gap-8 flex-1 max-w-2xl justify-center">
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-slate-900 transition-colors underline-offset-4 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={onNavigateProducts}
              className="hover:text-slate-900 transition-colors underline-offset-4 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              Products
            </button>
            <button
              type="button"
              onClick={onNavigateCategories}
              className="hover:text-slate-900 transition-colors underline-offset-4 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              Categories
            </button>
          </nav>

          <form
            onSubmit={handleSubmit}
            role="search"
            className="hidden sm:flex items-center relative w-full max-w-md"
          >
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search laptops, footwear, espresso, watches..."
              aria-label="Search products"
              className="w-full h-10 pl-10 pr-9 text-sm bg-slate-100/80 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Zone 3: Cart Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open shopping cart with ${cartCount} items`}
            className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded bg-white text-slate-900 text-xs font-bold tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
