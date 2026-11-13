import { Check, ShoppingCart, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Product } from '../types/product.ts';
import { formatCount, formatINR } from '../utils/formatters.ts';
import { PRODUCT_IMAGE_MAP } from '../utils/imageMap.ts';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductModal({
  product,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setAdded(false);
    if (!product) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) {
    return null;
  }

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1100);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
    >
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 text-slate-700 hover:text-slate-900 shadow-sm cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Image */}
        <div className="bg-stone-100 aspect-[4/3] md:aspect-auto md:h-full">
          <img
            src={PRODUCT_IMAGE_MAP[product.imageKey]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Purchase Module */}
        <div className="p-6 flex flex-col">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {product.category} · {product.brand}
          </div>
          <h2
            id="quickview-title"
            className="mt-2 font-display text-xl font-bold text-slate-900 leading-snug"
          >
            {product.name}
          </h2>

          <div className="mt-2.5 flex items-center gap-2 text-sm tabular-nums">
            <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
              <Star
                className="w-4 h-4 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
              {product.rating.toFixed(1)}
            </span>
            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <span className="text-slate-500">
              {formatCount(product.reviewCount)} verified reviews
            </span>
          </div>

          <div className="mt-4 text-2xl font-bold text-slate-900 tabular-nums">
            {formatINR(product.price)}
          </div>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          <ul className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-4">
            {product.highlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-slate-900 shrink-0" aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6">
            <button
              type="button"
              onClick={handleAdd}
              className={`w-full py-3 px-4 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                added
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" aria-hidden="true" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
