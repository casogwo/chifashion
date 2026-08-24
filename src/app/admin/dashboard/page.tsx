import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Dashboard | ChiFashion',
};

export default async function AdminDashboard() {
  const [totalSales, totalOrders, totalCustomers, pendingOrders, products, recentOrders, lowStock] =
    await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'paid' } }),
      prisma.order.count(),
      prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(DISTINCT email) as count FROM "Order"`.then((r) => Number(r[0].count)),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.product.count({ where: { status: 'active' } }),
      prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, orderNumber: true, customerName: true, email: true, total: true, status: true, createdAt: true } }),
      prisma.product.findMany({ where: { stock: { lte: 5 }, status: 'active' }, select: { id: true, name: true, stock: true, image: true, category: { select: { name: true } } }, orderBy: { stock: 'asc' }, take: 5 }),
    ]);

  const stats = [
    { label: 'Total Sales', value: formatPrice(totalSales._sum.total || 0), icon: '💰', color: 'bg-green-100 text-green-700' },
    { label: 'Total Orders', value: totalOrders.toString(), icon: '📦', color: 'bg-blue-100 text-blue-700' },
    { label: 'Customers', value: totalCustomers.toString(), icon: '👥', color: 'bg-purple-100 text-purple-700' },
    { label: 'Products', value: products.toString(), icon: '🏷️', color: 'bg-brand-100 text-brand-700' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-bold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-brand-600 text-sm hover:text-brand-700">View All</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatPrice(order.total)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-bold">Low Stock Alert</h2>
            <Link href="/admin/products" className="text-brand-600 text-sm hover:text-brand-700">View All</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">All products well stocked</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((product) => (
                <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category?.name}</p>
                  </div>
                  <span className={`text-sm font-bold ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                    {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
        >
          + Add Product
        </Link>
        <Link
          href="/admin/orders"
          className="border border-gray-200 hover:border-brand-400 text-gray-700 px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
        >
          Manage Orders
        </Link>
      </div>
    </div>
  );
}
