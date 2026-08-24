'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '📦' },
  { href: '/admin/orders', label: 'Orders', icon: '🛒' },
  { href: '/admin/content', label: 'Content', icon: '📝' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname === '/admin') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white shrink-0 hidden lg:flex flex-col">
        <div className="p-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-lg font-serif font-bold">ChiFashion</span>
          </Link>
          <p className="text-gray-400 text-xs mt-1">Admin Panel</p>
        </div>

        <nav className="px-4 space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                pathname.startsWith(item.href)
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <span>🌐</span> View Store
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="font-serif font-bold">Admin</span>
          </Link>
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`p-2 rounded text-sm whitespace-nowrap ${
                  pathname.startsWith(item.href) ? 'bg-brand-600' : 'text-gray-400'
                }`}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </header>

        <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
