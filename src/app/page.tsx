import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

const parseProduct = (p: any) => ({
  ...p,
  sizes: JSON.parse(p.sizes || '[]'),
  colors: JSON.parse(p.colors || '[]'),
});

async function getHomeData() {
  const [featured, newArrivals, content, settings] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true, status: 'active' },
      take: 4,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      where: { status: 'active' },
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.content.findMany(),
    prisma.storeSettings.findMany(),
  ]);

  const contentMap = Object.fromEntries(content.map((c) => [c.key, c.value]));
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return { featured: featured.map(parseProduct), newArrivals: newArrivals.map(parseProduct), contentMap, settingsMap };
}

export default async function HomePage() {
  const { featured, newArrivals, contentMap, settingsMap } = await getHomeData();

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] lg:h-[85vh] overflow-hidden">
        <Image
          src={contentMap.hero_image || ''}
          alt="ChiFashion Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/70 via-brand-900/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl">
              <p className="text-brand-200 text-sm tracking-[0.2em] uppercase mb-3 font-medium">
                New Collection 2024
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white leading-tight mb-4">
                {contentMap.hero_heading || 'Redefine Your Style'}
              </h1>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                {contentMap.hero_subheading || ''}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3.5 rounded-full font-medium transition-colors text-sm tracking-wide"
                >
                  {contentMap.hero_cta || 'Shop Now'}
                </Link>
                <Link
                  href="/about"
                  className="border-2 border-white/60 hover:border-white text-white px-8 py-3.5 rounded-full font-medium transition-colors text-sm tracking-wide"
                >
                  Our Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-brand-50 py-3 text-center">
        <p className="text-brand-700 text-sm font-medium tracking-wide">
          {contentMap.promo_banner || 'Free delivery on orders over ₦50,000'}
        </p>
      </section>

      {/* Featured Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-3">Featured Collection</h2>
          <p className="text-gray-500 text-sm">Handpicked pieces for the season</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-block border-2 border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white px-8 py-3 rounded-full font-medium transition-colors text-sm tracking-wide"
          >
            Shop Collection
          </Link>
        </div>
      </section>

      {/* Category Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Women', slug: 'female', emoji: '👗' },
            { name: 'Men', slug: 'male', emoji: '👔' },
            { name: 'Traditional', slug: 'traditional', emoji: '🎭' },
            { name: 'Accessories', slug: 'accessories', emoji: '👜' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?gender=${cat.slug === 'accessories' ? 'unisex' : cat.slug}`}
              className="group relative h-40 lg:h-56 rounded-xl overflow-hidden bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center"
            >
              <div className="text-center">
                <span className="text-4xl block mb-2">{cat.emoji}</span>
                <span className="font-serif text-lg lg:text-xl font-bold text-brand-800 group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </span>
              </div>
              <div className="absolute inset-0 bg-brand-500/0 group-hover:bg-brand-500/10 transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-brand-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-3">New Arrivals</h2>
            <p className="text-gray-500 text-sm">The latest additions to our collection</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/shop"
              className="inline-block bg-brand-500 hover:bg-brand-600 text-white px-8 py-3.5 rounded-full font-medium transition-colors text-sm tracking-wide"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* Payment Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-brand-50 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-3">How to Pay</h2>
            <p className="text-gray-500 text-sm">Simple bank transfer to place your order</p>
          </div>
          <div className="max-w-lg mx-auto bg-white rounded-xl p-6 shadow-sm border border-brand-100">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bank</span>
                <span className="font-medium">{settingsMap.bank_name || 'Guaranty Trust Bank (GTBank)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number</span>
                <span className="font-medium">{settingsMap.account_number || '0637568363'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name</span>
                <span className="font-medium">{settingsMap.account_name || 'Asogwo Chinaza Peace'}</span>
              </div>
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4">
              <p className="text-xs text-gray-500 text-center mb-3">
                After transferring, send your payment receipt to us via WhatsApp or email to confirm your order.
              </p>
              <div className="flex gap-3">
                <a
                  href={`https://wa.me/${settingsMap.phone || '091645033555'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-center py-2.5 rounded-full text-xs font-medium transition-colors"
                >
                  WhatsApp Us
                </a>
                <a
                  href={`mailto:${settingsMap.email || 'asogwochinazapeace@gmail.com'}?subject=Payment Confirmation`}
                  className="flex-1 border border-gray-300 hover:border-brand-400 text-gray-700 text-center py-2.5 rounded-full text-xs font-medium transition-colors"
                >
                  Email Receipt
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-brand-500 text-sm tracking-[0.2em] uppercase mb-3 font-medium">
              Our Story
            </p>
            <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-6 leading-tight">
              Crafted with Passion, Worn with Pride
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {contentMap.brand_story || ''}
            </p>
            <Link
              href="/about"
              className="inline-block text-brand-600 font-medium hover:text-brand-700 transition-colors text-sm"
            >
              Learn More &rarr;
            </Link>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <Image
              src={contentMap.hero_image || ''}
              alt="ChiFashion Brand"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-brand-900 py-16 lg:py-20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-serif text-white mb-3">
            {contentMap.newsletter_heading || 'Join the ChiFashion Family'}
          </h2>
          <p className="text-brand-200 mb-8 text-sm">
            {contentMap.newsletter_text || ''}
          </p>
          <form className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-brand-300 text-sm focus:outline-none focus:border-brand-400"
            />
            <button
              type="submit"
              className="bg-brand-500 hover:bg-brand-400 text-white px-6 py-3 rounded-full font-medium transition-colors text-sm whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
