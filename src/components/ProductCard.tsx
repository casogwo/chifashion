'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/components/CartProvider';
import { useToast } from '@/components/Toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  image: string;
  gender: string;
  occasion: string | null;
  featured: boolean;
  sizes: string[];
  colors: string[];
  stock: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [showSizeSelect, setShowSizeSelect] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [adding, setAdding] = useState(false);

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.sizes && product.sizes.length > 1) {
      setShowSizeSelect(!showSizeSelect);
      return;
    }

    doAdd(selectedSize);
  };

  const doAdd = (size: string) => {
    setAdding(true);
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.image,
      size,
      color: product.colors?.[0] || '',
      stock: product.stock,
    });
    showToast(`${product.name} added to cart`, product.image);
    setShowSizeSelect(false);
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <div className="product-card group block">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-brand-50 mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {discount && (
            <span className="absolute top-2 left-2 bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          {product.featured && !discount && (
            <span className="absolute top-2 left-2 bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              New
            </span>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      </Link>

      <div className="flex items-start justify-between gap-2">
        <Link href={`/product/${product.slug}`} className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors text-sm sm:text-base truncate">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {product.salePrice ? (
              <>
                <span className="text-brand-600 font-bold text-sm sm:text-base">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-gray-400 line-through text-sm">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-gray-900 font-bold text-sm sm:text-base">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </Link>

        <div className="relative">
          <button
            onClick={handleQuickAdd}
            disabled={adding || product.stock <= 0}
            className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              adding
                ? 'bg-green-500 text-white scale-95'
                : product.stock <= 0
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white active:scale-90'
            }`}
            title={product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
          >
            {adding ? (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </button>

          {showSizeSelect && (
            <div
              className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-lg border border-gray-100 p-3 z-50 min-w-[160px]"
              onClick={(e) => e.preventDefault()}
            >
              <p className="text-xs font-medium text-gray-500 mb-2">Select size</p>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedSize(size);
                      doAdd(size);
                    }}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors hover:bg-brand-50 hover:border-brand-400 hover:text-brand-600 border-gray-200 text-gray-600"
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSizeSelect(false);
                }}
                className="mt-2 text-xs text-gray-400 hover:text-gray-600 w-full text-center"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
