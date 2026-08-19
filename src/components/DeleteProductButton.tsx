'use client';

import { useRouter } from 'next/navigation';

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await fetch(`/api/products?id=${productId}`, { method: 'DELETE' });
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 text-xs font-medium"
    >
      Delete
    </button>
  );
}
