'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';

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
  category: { name: string; slug: string };
  sizes?: string;
}

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const ALL_COLORS = ['Black', 'White', 'Navy', 'Pink', 'Red', 'Gold'];

export default function ShopFilters({
  products,
  categories,
  initialCategory,
  initialGender,
  initialOccasion,
  initialSearch,
  initialFeatured,
}: {
  products: Product[];
  categories: { name: string; slug: string }[];
  initialCategory?: string;
  initialGender?: string;
  initialOccasion?: string;
  initialSearch?: string;
  initialFeatured?: string;
}) {
  const [search, setSearch] = useState(initialSearch || '');
  const [category, setCategory] = useState(initialCategory || '');
  const [gender, setGender] = useState(initialGender || '');
  const [occasion, setOccasion] = useState(initialOccasion || '');
  const [size, setSize] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q)
      );
    }
    if (category) result = result.filter((p) => p.category.slug === category);
    if (gender) result = result.filter((p) => p.gender === gender);
    if (occasion) result = result.filter((p) => p.occasion === occasion);
    if (size) {
      result = result.filter((p) => {
        const sizes = JSON.parse(p.sizes || '[]');
        return sizes.includes(size);
      });
    }
    if (minPrice) result = result.filter((p) => (p.salePrice || p.price) >= Number(minPrice));
    if (maxPrice) result = result.filter((p) => (p.salePrice || p.price) <= Number(maxPrice));

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, search, category, gender, occasion, size, sortBy, minPrice, maxPrice]);

  const hasActiveFilters = category || gender || occasion || size || minPrice || maxPrice || search;

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setGender('');
    setOccasion('');
    setSize('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <>
      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-full text-sm bg-white focus:outline-none focus:border-brand-400"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden px-4 py-3 border border-gray-200 rounded-full text-sm bg-white hover:border-brand-400"
          >
            Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-56 shrink-0`}>
          <div className="space-y-6 lg:sticky lg:top-24">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-brand-500 hover:text-brand-600 font-medium"
              >
                Clear All Filters
              </button>
            )}

            {/* Category */}
            <div>
              <h4 className="font-medium text-gray-900 text-sm mb-3">Category</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-brand-600">
                  <input
                    type="radio"
                    name="category"
                    checked={!category}
                    onChange={() => setCategory('')}
                    className="accent-brand-500"
                  />
                  All
                </label>
                {categories.map((cat) => (
                  <label key={cat.slug} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-brand-600">
                    <input
                      type="radio"
                      name="category"
                      checked={category === cat.slug}
                      onChange={() => setCategory(cat.slug)}
                      className="accent-brand-500"
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <h4 className="font-medium text-gray-900 text-sm mb-3">Gender</h4>
              <div className="space-y-2">
                {[
                  { label: 'All', value: '' },
                  { label: 'Women', value: 'female' },
                  { label: 'Men', value: 'male' },
                  { label: 'Unisex', value: 'unisex' },
                ].map((g) => (
                  <label key={g.value} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-brand-600">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === g.value}
                      onChange={() => setGender(g.value)}
                      className="accent-brand-500"
                    />
                    {g.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <h4 className="font-medium text-gray-900 text-sm mb-3">Occasion</h4>
              <div className="space-y-2">
                {[
                  { label: 'All', value: '' },
                  { label: 'Casual', value: 'casual' },
                  { label: 'Office', value: 'office' },
                  { label: 'Party', value: 'party' },
                  { label: 'Formal', value: 'formal' },
                  { label: 'Wedding', value: 'wedding' },
                  { label: 'Traditional', value: 'traditional' },
                ].map((o) => (
                  <label key={o.value} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-brand-600">
                    <input
                      type="radio"
                      name="occasion"
                      checked={occasion === o.value}
                      onChange={() => setOccasion(o.value)}
                      className="accent-brand-500"
                    />
                    {o.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-medium text-gray-900 text-sm mb-3">Price Range</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
                />
                <span className="text-gray-400 self-center">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">{filtered.length} products found</p>
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No products found matching your filters.</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-brand-500 hover:text-brand-600 font-medium text-sm"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
