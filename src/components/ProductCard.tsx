import { Check, Package, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../types/product.ts';
import { formatCount, formatINR } from '../utils/formatters.ts';
import { PRODUCT_IMAGE_MAP } from '../utils/imageMap.ts';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onSelectProduct,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const imageUrl = PRODUCT_IMAGE_MAP[product.imageKey];

  const handleAdd = () => {
    onAddToCart(product);
    setJustAdded(true);
    window.setTimeout(() => {
      setJustAdded(false);
    }, 1100);
  };

  return (
    <article className="group bg-white border border-slate-200/90 rounded-xl overflow-hidden flex flex-col h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5">
      {/* Image Frame (4:3 uniform aspect ratio) */}
      <button
        type="button"
        onClick={() => onSelectProduct(product)}
        className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-slate-900"
        aria-label={`View details for ${product.name}`}
      >
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-stone-200 p-4 text-center">
            <Package className="w-8 h-8 text-slate-400 mb-2" aria-hidden="true" />
            <span className="text-xs font-medium text-slate-500 line-clamp-2">
              {product.name}
            </span>
          </div>
        )}
      </button>

      {/* Card Metadata & CTA */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Brand (clean unboxed metadata) */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          <span className="truncate">{product.category}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate font-medium normal-case tracking-normal text-slate-400">
            {product.brand}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="mt-1.5 text-[15px] font-semibold leading-snug text-slate-900 min-h-[2.625rem] line-clamp-2">
          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="text-left hover:underline underline-offset-2 cursor-pointer"
          >
            {product.name}
          </button>
        </h3>

        {/* Rating & Reviews */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 tabular-nums">
          <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
            <Star
              className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
            {product.rating.toFixed(1)}
          </span>
          <span className="text-slate-300" aria-hidden="true">
            ·
          </span>
          <span className="text-slate-500">
            {formatCount(product.reviewCount)} reviews
          </span>
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-3.5">
          <div className="text-lg font-bold tracking-tight text-slate-900 tabular-nums">
            {formatINR(product.price)}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`mt-3 w-full py-2.5 px-4 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
              justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950'
            }`}
          >
            {justAdded ? (
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
    </article>
  );
}
