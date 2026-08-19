import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';

export const metadata = {
  title: 'Order Confirmation | ChiFashion',
};

export default async function OrderConfirmation({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderNumber = searchParams.order;

  if (!orderNumber) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">No order found.</p>
        <Link href="/shop" className="mt-4 inline-block text-brand-600 hover:text-brand-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
  });

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Link href="/shop" className="mt-4 inline-block text-brand-600 hover:text-brand-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const items = JSON.parse(order.items || '[]');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 lg:py-16 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl lg:text-3xl font-serif text-gray-900 mb-3">Thank You for Your Order!</h1>
      <p className="text-gray-500 mb-8">Your order has been confirmed and is being processed.</p>

      <div className="bg-brand-50 rounded-xl p-6 text-left mb-8">
        <div className="flex justify-between mb-4">
          <span className="text-sm text-gray-600">Order Number</span>
          <span className="font-bold text-brand-600">{order.orderNumber}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-sm text-gray-600">Date</span>
          <span className="text-sm">{order.createdAt.toLocaleDateString('en-NG')}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-sm text-gray-600">Payment Status</span>
          <span className={`text-sm font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
            {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
          </span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-sm text-gray-600">Order Status</span>
          <span className="text-sm font-medium capitalize">{order.status}</span>
        </div>

        <div className="border-t border-brand-200 pt-4 mt-4">
          <h4 className="font-medium text-sm mb-3">Items</h4>
          {items.map((item: any, i: number) => (
            <div key={i} className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">
                {item.name} × {item.quantity}
                {item.size && ` (${item.size})`}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-brand-200 pt-4 mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-brand-600">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        A confirmation email will be sent to <strong>{order.email}</strong>
      </p>

      <Link
        href="/shop"
        className="inline-block bg-brand-500 hover:bg-brand-600 text-white px-8 py-3.5 rounded-full font-medium transition-colors text-sm"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
