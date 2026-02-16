'use client';

import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

const tabs = [
    { href: '/', label: 'Главная', icon: Home },
    { href: '/catalog', label: 'Каталог', icon: LayoutGrid },
    { href: '/cart', label: 'Корзина', icon: ShoppingBag },
    { href: '/profile', label: 'Профиль', icon: User },
];

export default function BottomNav() {
    const pathname = usePathname();
    const cartCount = useCartStore((s) => s.totalItems());

    // Hide on florist panel pages
    if (pathname.startsWith('/florist')) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass-heavy border-t border-[var(--primary)]/[0.06]">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto pb-[env(safe-area-inset-bottom)]">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            aria-label={tab.label}
                            className="relative flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all duration-[var(--duration-normal)]"
                        >
                            {isActive && (
                                <span
                                    className="absolute -top-0.5 w-6 h-[3px] rounded-full"
                                    style={{
                                        background: 'var(--gradient-button)',
                                        boxShadow: '0 2px 8px rgba(196, 147, 122, 0.35)',
                                    }}
                                />
                            )}

                            <Icon
                                className={`w-[22px] h-[22px] transition-colors duration-[var(--duration-normal)] ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}
                                fill={isActive ? 'var(--primary-light)' : 'none'}
                            />
                            <span
                                className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-[var(--primary-dark)]' : 'text-[var(--text-muted)]'}`}
                            >
                                {tab.label}
                            </span>

                            {/* Cart badge */}
                            {tab.href === '/cart' && cartCount > 0 && (
                                <span
                                    className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full text-white text-[9px] flex items-center justify-center font-bold"
                                    style={{
                                        background: 'var(--gold)',
                                        boxShadow: '0 2px 6px rgba(201, 169, 110, 0.4)',
                                    }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
