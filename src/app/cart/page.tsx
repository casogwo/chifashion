'use client';

import { useCart } from '@/components/CartProvider';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const shipping = subtotal >= 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-serif text-gray-900 mb-3">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Discover our latest collection and find something you love.</p>
        <Link
          href="/shop"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white px-8 py-3.5 rounded-full font-medium transition-colors text-sm"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <h1 className="text-2xl lg:text-3xl font-serif text-gray-900 mb-8">
        Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
      </h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={`${item.id}-${item.size}-${item.color}`}
            className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl"
          >
            <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden bg-brand-50 shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/product/${item.slug}`}
                className="font-medium text-gray-900 hover:text-brand-600 text-sm sm:text-base"
              >
                {item.name}
              </Link>
              <div className="text-xs text-gray-500 mt-1">
                {item.size && `Size: ${item.size}`}
                {item.size && item.color && ' · '}
                {item.color && `Color: ${item.color}`}
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                    className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center text-sm hover:border-brand-400"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                    className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center text-sm hover:border-brand-400"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</span>
                  <button
                    onClick={() => removeItem(item.id, item.size, item.color)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-brand-50 rounded-xl p-6">
        <h3 className="font-serif text-lg font-bold mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                formatPrice(shipping)
              )}
            </span>
          </div>
          {shipping > 0 && (
            <p className="text-xs text-brand-600">
              Free shipping on orders over ₦50,000. Add {formatPrice(50000 - subtotal)} more!
            </p>
          )}
          <div className="border-t border-brand-200 pt-2 flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold text-brand-600">{formatPrice(total)}</span>
          </div>
        </div>
        <Link
          href="/checkout"
          className="block w-full bg-brand-500 hover:bg-brand-600 text-white text-center py-3.5 rounded-full font-medium text-sm mt-6 transition-colors"
        >
          Proceed to Checkout
        </Link>
        <Link
          href="/shop"
          className="block text-center text-brand-600 text-sm mt-3 hover:text-brand-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
