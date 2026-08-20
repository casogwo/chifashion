import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} | ChiFashion`,
    description: product.seoDescription || product.description.slice(0, 160),
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product || product.status !== 'active') notFound();

  const sizes = JSON.parse(product.sizes || '[]');
  const colors = JSON.parse(product.colors || '[]');
  const images = JSON.parse(product.images || '[]');

  const related = await prisma.product.findMany({
    where: {
      status: 'active',
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
    include: { category: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-600">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-brand-600">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-brand-50">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {product.salePrice && (
              <span className="absolute top-4 left-4 bg-brand-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                Sale
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-4">
              {images.slice(0, 4).map((img: string, i: number) => (
                <div key={i} className="relative w-20 h-24 rounded-lg overflow-hidden bg-brand-50 border-2 border-brand-200">
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-brand-500 text-sm font-medium tracking-wide uppercase mb-2">
            {product.category.name}
          </p>
          <h1 className="text-2xl lg:text-3xl font-serif text-gray-900 mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-bold text-brand-600">{formatPrice(product.salePrice)}</span>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-1 rounded-full">
                  Save {formatPrice(product.price - product.salePrice)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          <AddToCartButton
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.salePrice || product.price,
              image: product.image,
              stock: product.stock,
              sizes,
              colors,
            }}
          />

          {/* Product Info */}
          <div className="mt-8 space-y-4 border-t border-gray-100 pt-8">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free delivery on orders over ₦50,000
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Easy returns within 7 days
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure checkout
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16 lg:mt-20">
          <h2 className="text-2xl font-serif text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
