'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

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
}

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null;

  return (
    <Link href={`/product/${product.slug}`} className="product-card group block">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-brand-50 mb-3">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
          priority={product.featured}
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
      <div>
        <h3 className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors text-sm sm:text-base">
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
      </div>
    </Link>
  );
}
