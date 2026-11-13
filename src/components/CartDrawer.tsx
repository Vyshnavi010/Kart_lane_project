import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CartItem } from '../types/product.ts';
import { formatINR } from '../utils/formatters.ts';
import { PRODUCT_IMAGE_MAP } from '../utils/imageMap.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [orderConfirmedId, setOrderConfirmedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingThreshold = 2000;
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingFee = qualifiesForFreeShipping ? 0 : 149;
  const grandTotal = subtotal + shippingFee;

  const handlePlaceOrder = () => {
    const orderNumber = `KL-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderConfirmedId(orderNumber);
    onClearCart();
  };

  const handleClose = () => {
    setOrderConfirmedId(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px]"
        onClick={handleClose}
      />

      {/* Drawer Panel */}
      <aside className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-slate-900" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-slate-900">
              Your Cart
            </h2>
            <span className="text-sm text-slate-500 tabular-nums">
              ({totalUnits})
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close cart"
            className="p-2 -mr-2 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {orderConfirmedId ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2
                className="w-12 h-12 text-emerald-600 mx-auto"
                aria-hidden="true"
              />
              <h3 className="font-display text-xl font-bold text-slate-900">
                Order #{orderConfirmedId} Confirmed
              </h3>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">
                Thank you for shopping with KARTLANE. Your items are being
                prepared for dispatch.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-4 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingBag
                className="w-10 h-10 text-slate-300 mx-auto"
                aria-hidden="true"
              />
              <h3 className="font-display text-base font-semibold text-slate-900">
                Your shopping cart is empty
              </h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Browse the catalog and add products to see your itemized summary
                here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="py-4 flex gap-4">
                  <img
                    src={PRODUCT_IMAGE_MAP[product.imageKey]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-16 object-cover rounded-lg bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 line-clamp-2">
                        {product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {product.category}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-slate-200 rounded-lg">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          aria-label={`Decrease quantity of ${product.name}`}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-l-lg cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-slate-900 tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          aria-label={`Increase quantity of ${product.name}`}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-r-lg cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        {formatINR(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && !orderConfirmedId && (
          <div className="border-t border-slate-200 px-6 py-5 bg-slate-50 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900 tabular-nums">
                  {formatINR(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="font-medium text-slate-900 tabular-nums">
                  {shippingFee === 0 ? 'Free' : formatINR(shippingFee)}
                </span>
              </div>
              {!qualifiesForFreeShipping && (
                <p className="text-xs text-slate-500">
                  Add {formatINR(freeShippingThreshold - subtotal)} more for
                  complimentary delivery.
                </p>
              )}
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="tabular-nums">{formatINR(grandTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              className="w-full py-3 px-4 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
