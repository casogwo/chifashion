import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/ProductForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Edit Product | Admin - ChiFashion',
};

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!product) {
    return <div className="text-center py-16 text-gray-500">Product not found</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 text-sm mt-1">Update product details</p>
      </div>
      <ProductForm
        product={{
          ...product,
          sizes: JSON.parse(product.sizes || '[]'),
          colors: JSON.parse(product.colors || '[]'),
          images: JSON.parse(product.images || '[]'),
          salePrice: product.salePrice,
          occasion: product.occasion || '',
        }}
        categories={categories}
      />
    </div>
  );
}
