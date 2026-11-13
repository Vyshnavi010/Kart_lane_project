import { useCallback, useEffect, useRef, useState } from 'react';
import { CartDrawer } from './components/CartDrawer.tsx';
import { FilterSidebar } from './components/FilterSidebar.tsx';
import { Header } from './components/Header.tsx';
import { ProductGrid } from './components/ProductGrid.tsx';
import { ProductModal } from './components/ProductModal.tsx';
import { fetchFilteredProducts } from './services/productApi.ts';
import {
  PRODUCT_CATEGORIES,
  type CartItem,
  type Product,
  type ProductCategory,
  type SortOption,
} from './types/product.ts';

const INITIAL_CATEGORY_COUNTS: Record<ProductCategory, number> = {
  Electronics: 10,
  Apparel: 10,
  Footwear: 10,
  'Home & Kitchen': 10,
  Accessories: 10,
};

const CART_STORAGE_KEY = 'kartlane_cart_v1';

export default function App() {
  // Filter & Sort state
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Catalog state from Express API
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(50);
  const [categoryCounts, setCategoryCounts] = useState<Record<ProductCategory, number>>(
    INITIAL_CATEGORY_COUNTS,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cart & UI Overlays
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const productsSectionRef = useRef<HTMLDivElement | null>(null);
  const categorySectionRef = useRef<HTMLElement | null>(null);

  // Persist cart
  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  // Fetch filtered & sorted inventory from Express backend whenever any criterion changes
  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        setErrorMessage(null);
        const data = await fetchFilteredProducts(
          {
            categories: selectedCategories,
            minPrice,
            maxPrice,
            minRating,
            sortBy,
            searchQuery,
          },
          controller.signal,
        );
        setProducts(data.products);
        setTotalCount(data.totalCount);
        setCategoryCounts(data.categoryCounts);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setErrorMessage('Unable to refresh product inventory. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadProducts();
    return () => controller.abort();
  }, [selectedCategories, minPrice, maxPrice, minRating, sortBy, searchQuery]);

  const handleToggleCategory = useCallback((category: ProductCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  }, []);

  const handlePriceChange = useCallback((nextMin: number, nextMax: number) => {
    setMinPrice(nextMin);
    setMaxPrice(nextMax);
  }, []);

  const handleResetAll = useCallback(() => {
    setSelectedCategories([]);
    setMinPrice(0);
    setMaxPrice(100000);
    setMinRating(0);
    setSearchQuery('');
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const handleRemoveItem = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const handleNavigateHome = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigateProducts = useCallback(() => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleNavigateCategories = useCallback(() => {
    if (window.innerWidth < 1024) {
      setIsMobileFiltersOpen(true);
    } else {
      categorySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    minPrice > 0 ||
    maxPrice < 100000 ||
    minRating > 0 ||
    searchQuery.trim().length > 0;

  const activeFilterCount =
    selectedCategories.length +
    (minPrice > 0 || maxPrice < 100000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (searchQuery.trim().length > 0 ? 1 : 0);

  return (
    <div id="top" className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateHome={handleNavigateHome}
        onNavigateProducts={handleNavigateProducts}
        onNavigateCategories={handleNavigateCategories}
      />

      {/* Storefront Intro Strip */}
      <section className="bg-white border-b border-slate-200/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Curated Everyday Essentials
            </p>
            <h1 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              Precision Goods Across Five Core Categories
            </h1>
          </div>

          {/* Quick Category Shortcuts */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg self-start md:self-auto">
            <button
              type="button"
              onClick={() => setSelectedCategories([])}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategories.length === 0
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            {PRODUCT_CATEGORIES.map((category) => {
              const active =
                selectedCategories.length === 1 &&
                selectedCategories[0] === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategories([category])}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <main
        ref={productsSectionRef}
        className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
      >
        <div className="flex flex-col lg:flex-row items-start gap-6 xl:gap-8">
          {/* LEFT SIDE: Sticky Filter Sidebar (Desktop) */}
          <aside
            aria-label="Product filters"
            className="hidden lg:block w-[280px] xl:w-[300px] shrink-0 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto"
          >
            <FilterSidebar
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              minRating={minRating}
              onRatingChange={setMinRating}
              onResetAll={handleResetAll}
              categoryCounts={categoryCounts}
              hasActiveFilters={hasActiveFilters}
              categorySectionRef={categorySectionRef}
            />
          </aside>

          {/* RIGHT SIDE: Product Inventory Grid */}
          <ProductGrid
            products={products}
            totalCount={totalCount}
            isLoading={isLoading}
            errorMessage={errorMessage}
            sortBy={sortBy}
            onSortChange={setSortBy}
            selectedCategories={selectedCategories}
            onRemoveCategory={handleToggleCategory}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onResetPrice={() => handlePriceChange(0, 100000)}
            minRating={minRating}
            onResetRating={() => setMinRating(0)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onResetAll={handleResetAll}
            onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
            onAddToCart={handleAddToCart}
            onSelectProduct={setSelectedProduct}
            activeFilterCount={activeFilterCount}
          />
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} KARTLANE. All prices inclusive of taxes in INR.</span>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={handleNavigateHome}
              className="hover:text-slate-900 cursor-pointer"
            >
              Back to top
            </button>
            <button
              type="button"
              onClick={handleResetAll}
              className="hover:text-slate-900 cursor-pointer"
            >
              View full catalog
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Filter Drawer */}
      {isMobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Filter products"
        >
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px]"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xs bg-slate-50 h-full overflow-y-auto p-4 shadow-2xl">
            <FilterSidebar
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              minRating={minRating}
              onRatingChange={setMinRating}
              onResetAll={handleResetAll}
              categoryCounts={categoryCounts}
              hasActiveFilters={hasActiveFilters}
              onCloseMobile={() => setIsMobileFiltersOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Product Quick-View Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
