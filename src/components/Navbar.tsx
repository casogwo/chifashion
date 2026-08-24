'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl lg:text-2xl font-serif font-bold text-brand-700">
              ChiFashion
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/shop" className="text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors">
              Shop
            </Link>
            <Link href="/shop?category=dresses" className="text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors">
              Dresses
            </Link>
            <Link href="/shop?gender=male" className="text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors">
              Men
            </Link>
            <Link href="/shop?gender=female" className="text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors">
              Women
            </Link>
            <Link href="/shop?occasion=traditional" className="text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors">
              Traditional
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors">
              Contact
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <div className="relative group">
              <Link
                href="/shop?search="
                className="p-2.5 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Search Products
              </span>
            </div>

            {/* Cart */}
            <div className="relative group">
              <Link
                href="/cart"
                className="p-2.5 text-gray-600 hover:text-gray-900 transition-colors relative"
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-white">
                    {totalItems}
                  </span>
                )}
              </Link>
              <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                Cart ({totalItems} items)
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2.5 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-brand-100 py-4 space-y-3">
            <Link href="/shop" className="block py-2 text-gray-700 hover:text-brand-600" onClick={() => setMobileOpen(false)}>Shop</Link>
            <Link href="/shop?category=dresses" className="block py-2 text-gray-700 hover:text-brand-600" onClick={() => setMobileOpen(false)}>Dresses</Link>
            <Link href="/shop?gender=male" className="block py-2 text-gray-700 hover:text-brand-600" onClick={() => setMobileOpen(false)}>Men</Link>
            <Link href="/shop?gender=female" className="block py-2 text-gray-700 hover:text-brand-600" onClick={() => setMobileOpen(false)}>Women</Link>
            <Link href="/shop?occasion=traditional" className="block py-2 text-gray-700 hover:text-brand-600" onClick={() => setMobileOpen(false)}>Traditional</Link>
            <Link href="/about" className="block py-2 text-gray-700 hover:text-brand-600" onClick={() => setMobileOpen(false)}>About</Link>
            <Link href="/contact" className="block py-2 text-gray-700 hover:text-brand-600" onClick={() => setMobileOpen(false)}>Contact</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
