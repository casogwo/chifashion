'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  categoryId: string;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  status: string;
  occasion: string | null;
  gender: string;
}

export default function ProductForm({
  product,
  categories,
}: {
  product?: ProductData;
  categories: Category[];
}) {
  const router = useRouter();
  const isEdit = !!product?.id;
  const galleryRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    salePrice: product?.salePrice || '',
    categoryId: product?.categoryId || categories[0]?.id || '',
    image: product?.image || '',
    sizes: product?.sizes || ['S', 'M', 'L', 'XL'],
    colors: product?.colors || ['Black', 'White'],
    stock: product?.stock || 0,
    featured: product?.featured || false,
    status: product?.status || 'active',
    occasion: product?.occasion || 'casual',
    gender: product?.gender || 'unisex',
  });

  const [gallery, setGallery] = useState<string[]>(product?.images || []);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setGalleryUploading(true);
    setError('');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 4 * 1024 * 1024) {
        setError(`"${file.name}" is too large. Max 4MB each.`);
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
          setGallery((prev) => [...prev, data.url]);
        } else {
          setError(`Failed to upload "${file.name}": ${data.error}`);
        }
      } catch {
        setError(`Failed to upload "${file.name}"`);
      }
    }

    setGalleryUploading(false);
    if (galleryRef.current) galleryRef.current.value = '';
  };

  const removeGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const moveGalleryImage = (from: number, to: number) => {
    if (to < 0 || to >= gallery.length) return;
    setGallery((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        slug: form.slug || generateSlug(form.name),
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        stock: Number(form.stock),
        images: gallery,
      };

      const url = isEdit ? `/api/products?id=${product!.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin/products');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder={generateSlug(form.name)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400 resize-none"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            required
            min={0}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (₦)</label>
          <input
            type="number"
            value={form.salePrice}
            onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
            min={0}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            required
            min={0}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
          <select
            value={form.occasion}
            onChange={(e) => setForm({ ...form, occasion: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
          >
            {['casual', 'formal', 'party', 'office', 'wedding', 'traditional'].map((o) => (
              <option key={o} value={o}>
                {o.charAt(0).toUpperCase() + o.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
          >
            <option value="male">Men</option>
            <option value="female">Women</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>
      </div>

      <ImageUpload
        value={form.image}
        onChange={(url) => setForm({ ...form, image: url })}
        label="Main Image *"
        required
      />

      {/* Gallery Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gallery Images
          <span className="text-gray-400 font-normal ml-1">({gallery.length} images)</span>
        </label>
        <p className="text-xs text-gray-400 mb-3">Extra photos shown on the product page. Upload as many as you need.</p>

        {gallery.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {gallery.map((img, i) => (
              <div key={i} className="relative group w-24 h-28 rounded-lg overflow-hidden border border-gray-200 bg-brand-50">
                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 hidden group-hover:flex items-center justify-center gap-1">
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => moveGalleryImage(i, i - 1)}
                      className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-xs hover:bg-white shadow"
                      title="Move left"
                    >
                      ←
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="w-6 h-6 bg-red-500/90 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-500 shadow"
                    title="Remove"
                  >
                    ✕
                  </button>
                  {i < gallery.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveGalleryImage(i, i + 1)}
                      className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-xs hover:bg-white shadow"
                      title="Move right"
                    >
                      →
                    </button>
                  )}
                </div>
                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        )}

        <label className={`block border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
          galleryUploading
            ? 'border-brand-400 bg-brand-50'
            : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'
        }`}>
          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryUpload}
            disabled={galleryUploading}
            className="sr-only"
          />
          {galleryUploading ? (
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Uploading...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 py-1">
              <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm text-gray-600 font-medium">Add more images</span>
              <span className="text-xs text-gray-400">(select multiple at once)</span>
            </div>
          )}
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
          <div className="flex flex-wrap gap-2">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'].map((size) => (
              <label key={size} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.sizes.includes(size)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm({ ...form, sizes: [...form.sizes, size] });
                    } else {
                      setForm({ ...form, sizes: form.sizes.filter((s) => s !== size) });
                    }
                  }}
                  className="accent-brand-500"
                />
                <span className="text-sm text-gray-600">{size}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma separated)</label>
          <input
            type="text"
            value={form.colors.join(', ')}
            onChange={(e) =>
              setForm({
                ...form,
                colors: e.target.value.split(',').map((c) => c.trim()).filter(Boolean),
              })
            }
            placeholder="Black, White, Navy"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="accent-brand-500 w-4 h-4"
          />
          <span className="text-sm text-gray-700">Featured on homepage</span>
        </label>
        <div>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-full font-medium text-sm transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-full font-medium text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
