'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import { formatPrice } from '@/lib/utils';

interface StoreSettings {
  bank_name: string;
  account_number: string;
  account_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  delivery_fee: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [settings, setSettings] = useState<StoreSettings>({
    bank_name: 'Guaranty Trust Bank (GTBank)',
    account_number: '0637568363',
    account_name: 'Asogwo Chinaza Peace',
    phone: '09164503355',
    whatsapp: '09164503355',
    email: 'asogwochinazapeace@gmail.com',
    delivery_fee: 2500,
  });

  useEffect(() => {
    fetch('/api/settings/public')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings((prev) => ({ ...prev, ...data.settings }));
      })
      .catch(() => {});
  }, []);

  const deliveryFee = items.reduce((sum, item) => sum + (item.deliveryFee || 2500), 0);
  const total = subtotal + deliveryFee;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
    paymentMethod: 'transfer',
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.image,
          })),
          subtotal,
          shipping: deliveryFee,
          total,
        }),
      });

      const data = await res.json();
      if (data.success) {
        clearCart();
        router.push(`/order-confirmation?order=${data.orderNumber}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Your cart is empty. Add items before checking out.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <h1 className="text-2xl lg:text-3xl font-serif text-gray-900 mb-8">Checkout</h1>

      <div className="flex items-center justify-center gap-4 mb-10">
        {['Information', 'Delivery', 'Payment'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step > i + 1
                  ? 'bg-green-500 text-white'
                  : step === i + 1
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-sm ${step === i + 1 ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
              {s}
            </span>
            {i < 2 && <div className="w-8 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold mb-4">Your Information</h2>
              <input
                type="text"
                placeholder="Full Name *"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
              />
              <input
                type="email"
                placeholder="Email Address *"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
              />
              <button
                onClick={() => setStep(2)}
                disabled={!form.name || !form.email || !form.phone}
                className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 disabled:text-gray-500 text-white py-3.5 rounded-full font-medium text-sm mt-4 transition-colors"
              >
                Continue to Delivery
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold mb-4">Delivery Address</h2>
              <input
                type="text"
                placeholder="Street Address *"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City *"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
                />
                <input
                  type="text"
                  placeholder="State *"
                  value={form.state}
                  onChange={(e) => update('state', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
                />
              </div>
              <select
                value={form.country}
                onChange={(e) => update('country', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-400"
              >
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option>
                <option value="South Africa">South Africa</option>
              </select>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-200 rounded-full text-sm font-medium hover:border-brand-400"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!form.address || !form.city || !form.state}
                  className="flex-1 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 disabled:text-gray-500 text-white py-3.5 rounded-full font-medium text-sm transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold mb-4">Payment</h2>

              <div className="bg-brand-50 border border-brand-200 rounded-xl p-5">
                <h3 className="font-serif font-bold text-sm mb-3">Make a Bank Transfer</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank</span>
                    <span className="font-medium">{settings.bank_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Number</span>
                    <span className="font-bold text-lg">{settings.account_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Name</span>
                    <span className="font-medium">{settings.account_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-bold text-brand-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center">
                After transferring, send your payment receipt via WhatsApp or email so we can process your order.
              </p>

              <div className="flex gap-3">
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-full text-sm font-medium transition-colors"
                >
                  Send Receipt on WhatsApp
                </a>
                <a
                  href={`mailto:${settings.email}?subject=Payment Confirmation - ${formatPrice(total)}`}
                  className="flex-1 border border-gray-300 hover:border-brand-400 text-gray-700 text-center py-3 rounded-full text-sm font-medium transition-colors"
                >
                  Email Receipt
                </a>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-200 rounded-full text-sm font-medium hover:border-brand-400"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white py-3.5 rounded-full font-medium text-sm transition-colors"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-brand-50 rounded-xl p-5 sticky top-24">
            <h3 className="font-serif font-bold mb-4">Order Summary</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3 text-sm">
                  <div className="relative w-14 h-16 rounded overflow-hidden bg-brand-100 shrink-0">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.size && `${item.size} · `}
                      {item.color && `${item.color} · `}
                      Qty: {item.quantity}
                    </p>
                    <p className="font-medium text-xs mt-1">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-brand-200 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-brand-200 pt-2">
                <span>Total</span>
                <span className="text-brand-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
