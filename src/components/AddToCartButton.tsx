'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartProvider';

interface Props {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    sizes: string[];
    colors: string[];
  };
}

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      stock: product.stock,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-5">
      {product.sizes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Size: <span className="text-brand-600">{selectedSize}</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-200 text-gray-600 hover:border-brand-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Color: <span className="text-brand-600">{selectedColor}</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  selectedColor === color
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-200 text-gray-600 hover:border-brand-300'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Quantity</h4>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:border-brand-400"
          >
            -
          </button>
          <span className="w-10 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:border-brand-400"
          >
            +
          </button>
        </div>
      </div>

      {product.stock <= 5 && product.stock > 0 && (
        <p className="text-sm text-amber-600 font-medium">
          Only {product.stock} left in stock
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className={`flex-1 py-3.5 rounded-full font-medium text-sm tracking-wide transition-all ${
            added
              ? 'bg-green-500 text-white'
              : product.stock === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-brand-500 hover:bg-brand-600 text-white'
          }`}
        >
          {added ? '✓ Added to Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
