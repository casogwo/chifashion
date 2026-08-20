import { prisma } from '@/lib/prisma';
import ShopFilters from '@/components/ShopFilters';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shop | ChiFashion',
  description: 'Browse our curated collection of premium fashion for every occasion.',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const gender = typeof searchParams.gender === 'string' ? searchParams.gender : undefined;
  const occasion = typeof searchParams.occasion === 'string' ? searchParams.occasion : undefined;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const featured = typeof searchParams.featured === 'string' ? searchParams.featured : undefined;

  const products = await prisma.product.findMany({
    where: { status: 'active' },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-2">
          {category
            ? categories.find((c) => c.slug === category)?.name || 'Shop'
            : gender === 'male'
            ? "Men's Collection"
            : gender === 'female'
            ? "Women's Collection"
            : occasion
            ? occasion.charAt(0).toUpperCase() + occasion.slice(1) + ' Collection'
            : 'Shop All'}
        </h1>
        <p className="text-gray-500 text-sm">Discover your perfect look</p>
      </div>

      <ShopFilters
        products={products.map((p) => ({
          ...p,
          sizes: JSON.parse(p.sizes || '[]'),
          colors: JSON.parse(p.colors || '[]'),
          images: p.images,
        }))}
        categories={categories}
        initialCategory={category}
        initialGender={gender}
        initialOccasion={occasion}
        initialSearch={search}
        initialFeatured={featured}
      />
    </div>
  );
}
