import { prisma } from '@/lib/prisma';
import ContentEditor from '@/components/ContentEditor';

export const metadata = {
  title: 'Content | Admin - ChiFashion',
};

export default async function AdminContentPage() {
  const content = await prisma.content.findMany({
    orderBy: { key: 'asc' },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Website Content</h1>
        <p className="text-gray-500 text-sm mt-1">Manage homepage and store content</p>
      </div>
      <ContentEditor content={content} />
    </div>
  );
}
