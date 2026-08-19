import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/ProductForm';

export const metadata = {
  title: 'Add Product | Admin - ChiFashion',
};

export default async function AddProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 text-sm mt-1">Create a new product listing</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
