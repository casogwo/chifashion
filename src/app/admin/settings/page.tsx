import { prisma } from '@/lib/prisma';
import StoreSettingsForm from '@/components/StoreSettingsForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Store Settings | Admin - ChiFashion',
};

export default async function AdminSettingsPage() {
  const settings = await prisma.storeSettings.findMany({
    orderBy: { key: 'asc' },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Store Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your store contact, payment, and shipping details</p>
      </div>
      <StoreSettingsForm settings={settings} />
    </div>
  );
}
