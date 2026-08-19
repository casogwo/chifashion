import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export const metadata = {
  title: 'About Us | ChiFashion',
  description: 'Learn about ChiFashion - a premium Nigerian fashion brand.',
};

export default async function AboutPage() {
  const content = await prisma.content.findMany();
  const contentMap = Object.fromEntries(content.map((c) => [c.key, c.value]));

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
        <Image
          src={contentMap.hero_image || ''}
          alt="ChiFashion About"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-brand-900/60" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <p className="text-brand-200 text-sm tracking-[0.2em] uppercase mb-3">Our Story</p>
            <h1 className="text-4xl lg:text-5xl font-serif text-white mb-4">About ChiFashion</h1>
            <p className="text-white/80 text-lg max-w-xl">
              Celebrating African elegance with a modern twist
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl lg:text-3xl font-serif text-gray-900">Our Story</h2>
          <p className="text-gray-600 leading-relaxed">
            {contentMap.brand_story || 'ChiFashion was born from a passion for African fashion and a vision to create premium clothing that celebrates our heritage while embracing modern style.'}
          </p>
          <p className="text-gray-600 leading-relaxed">
            Founded in Lagos, Nigeria, ChiFashion draws inspiration from the vibrant culture, rich traditions, and dynamic energy of Africa. Every piece in our collection is designed to make you feel confident, elegant, and connected to your roots.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-50 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl lg:text-3xl font-serif text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Quality Craftsmanship',
                description: 'Every garment is made with attention to detail and premium materials, ensuring you receive nothing but the best.',
                icon: '✦',
              },
              {
                title: 'Cultural Pride',
                description: 'We celebrate African heritage through bold prints, vibrant colors, and designs that tell our story.',
                icon: '◆',
              },
              {
                title: 'Sustainable Fashion',
                description: 'We are committed to ethical practices, working with local artisans and using sustainable materials wherever possible.',
                icon: '●',
              },
            ].map((value) => (
              <div key={value.title} className="bg-white rounded-xl p-8 text-center">
                <div className="text-3xl text-brand-500 mb-4">{value.icon}</div>
                <h3 className="font-serif text-lg font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping & Returns */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-serif font-bold mb-4">Shipping Information</h2>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li>• Free shipping on orders over ₦50,000</li>
              <li>• Standard delivery: 3-5 business days within Nigeria</li>
              <li>• Express delivery available at checkout</li>
              <li>• International shipping available to select countries</li>
              <li>• Tracking information provided with every order</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold mb-4">Returns & Exchanges</h2>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li>• 7-day return policy from date of delivery</li>
              <li>• Items must be unworn with tags attached</li>
              <li>• Free returns for defective items</li>
              <li>• Exchanges available for different sizes</li>
              <li>• Refunds processed within 5-7 business days</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
