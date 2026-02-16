'use client';

import { motion } from 'framer-motion';
import {
    Package, Heart, Settings, ChevronRight, CreditCard,
    MapPin, Gift, Bell, HelpCircle, LogOut, User, LogIn, Plus, Info
} from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useAuthStore } from '@/store/authStore';
import { Strings } from '@/lib/strings';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { updateProfile, getProfile } from '@/lib/api';

export default function ProfilePage() {
    const router = useRouter();
    const { user, logout, isAuthenticated, login } = useAuthStore();
    const isLoggedIn = isAuthenticated();

    // Refresh user data from API on every page load
    useEffect(() => {
        if (!isLoggedIn) return;
        const { token, refreshToken, login: storeLogin } = useAuthStore.getState();
        getProfile()
            .then((freshUser) => {
                if (token && refreshToken) {
                    storeLogin(freshUser, token, refreshToken);
                }
            })
            .catch(() => { });
    }, [isLoggedIn]);

    const cartTotal = useCartStore((s) => s.totalItems());
    const favsCount = useFavoritesStore((s) => s.ids.length);

    // Card Input State
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [cardNumberInput, setCardNumberInput] = useState('');
    const [isSubmittingCard, setIsSubmittingCard] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/profile');
        router.refresh();
    };

    const handleAddCard = async () => {
        if (!cardNumberInput.trim()) return;
        setIsSubmittingCard(true);
        try {
            const updatedUser = await updateProfile({ loyalty_card_number: cardNumberInput });
            // Update store
            const { token, refreshToken } = useAuthStore.getState();
            if (token && refreshToken) {
                login(updatedUser, token, refreshToken);
            }
            setIsAddingCard(false);
        } catch (e) {
            console.error(e);
            alert('Ошибка при добавлении карты');
        } finally {
            setIsSubmittingCard(false);
        }
    };

    if (!isLoggedIn || !user) {
        return (
            <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-[var(--surface)] p-8 rounded-2xl shadow-lg border border-[var(--primary-light)]/20"
                >
                    <div className="w-20 h-20 bg-[var(--primary-light)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-10 h-10 text-[var(--primary)]" />
                    </div>

                    <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        Личный кабинет
                    </h1>
                    <p className="text-[var(--text-secondary)] mb-8">
                        Войдите, чтобы отслеживать заказы, копить бонусы и сохранять любимые букеты.
                    </p>

                    <div className="space-y-3">
                        <Link href="/auth/login" className="block w-full py-3 bg-[var(--primary)] text-white rounded-xl font-medium shadow-lg shadow-[var(--primary)]/30 hover:shadow-xl transition-shadow">
                            {Strings.login || 'Войти'}
                        </Link>
                        <Link href="/auth/register" className="block w-full py-3 bg-white border border-[var(--primary)] text-[var(--primary)] rounded-xl font-medium hover:bg-[var(--primary-light)]/10 transition-colors">
                            {Strings.register || 'Регистрация'}
                        </Link>
                    </div>

                    <div className="mt-8 pt-8 border-t border-[var(--text-secondary)]/10">
                        <Link href="/profile/help" className="flex items-center justify-center gap-2 text-[var(--text-secondary)] text-sm hover:text-[var(--primary)]">
                            <HelpCircle className="w-4 h-4" />
                            <span>Нужна помощь?</span>
                        </Link>
                    </div>
                </motion.div>
            </main>
        );
    }

    const { name, phone, discount, cardNumber } = {
        name: user.first_name || user.username,
        phone: user.phone || '',
        discount: Number(user.loyalty_discount) || 0,
        cardNumber: user.loyalty_card_number || null,
        ...user
    };

    const initials = (name || 'G')[0].toUpperCase();

    const menuSections = [
        {
            items: [
                { href: '/profile/orders', label: 'Мои заказы', icon: Package, badge: null },
                { href: '/favorites', label: 'Избранное', icon: Heart, badge: favsCount > 0 ? String(favsCount) : null },
            ],
        },
        {
            items: [
                { href: '/profile/settings', label: 'Настройки', icon: Settings, badge: null },
                { href: '/profile/help', label: 'Помощь', icon: HelpCircle, badge: null },
            ],
        },
    ];

    return (
        <main className="min-h-screen pb-24">
            {/* Header with gradient */}
            <div
                className="relative px-4 pt-12 pb-20 overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 60%, var(--primary-dark) 100%)',
                }}
            >
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-xl" />

                {/* Settings gear */}
                <Link
                    href="/profile/settings"
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                >
                    <Settings className="w-5 h-5 text-white" />
                </Link>

                {/* Avatar */}
                <div className="flex flex-col items-center relative z-10">
                    <motion.div
                        className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center mb-3 ring-4 ring-white/40 shadow-lg overflow-hidden"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                        <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                            {initials}
                        </span>
                    </motion.div>

                    <motion.h1
                        className="text-xl font-bold text-white mb-0.5"
                        style={{ fontFamily: 'var(--font-heading)' }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {name}
                    </motion.h1>
                    <motion.p
                        className="text-white/70 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {phone}
                    </motion.p>
                </div>
            </div>

            {/* Discount Card */}
            <div className="px-4 -mt-12 mb-6 relative z-20">
                <motion.div
                    className="rounded-[var(--radius-xl)] p-5 text-white shadow-lg overflow-hidden relative"
                    style={{
                        background: 'linear-gradient(135deg, #2D2D3A 0%, #1a1a2e 60%, #16213e 100%)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="relative z-10">
                        {cardNumber ? (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-white/50 mb-0.5">Карта клиента</p>
                                        <p className="text-lg font-bold tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>
                                            {cardNumber}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase tracking-wider text-white/50 mb-0.5">Скидка</p>
                                        <p className="text-2xl font-bold text-[var(--primary-light)]" style={{ fontFamily: 'var(--font-accent)' }}>
                                            {user.is_loyalty_confirmed ? discount : 0}%
                                        </p>
                                    </div>
                                </div>
                                {!user.is_loyalty_confirmed && (
                                    <div className="text-xs text-yellow-300 bg-yellow-500/20 p-2 rounded-lg flex items-start gap-2">
                                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>Ожидает подтверждения администратором. Скидка станет доступна после проверки.</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-2">
                                {isAddingCard ? (
                                    <div className="w-full">
                                        <p className="text-sm mb-3">Введите номер вашей карты:</p>
                                        <input
                                            type="text"
                                            value={cardNumberInput}
                                            onChange={(e) => setCardNumberInput(e.target.value)}
                                            placeholder="FL-..."
                                            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/30 mb-3 focus:outline-none focus:border-[var(--primary)]"
                                        />
                                        <div className="text-xs text-white/60 mb-4 bg-white/5 p-2 rounded">
                                            ⚠️ После ввода карта будет отправлена на проверку. Администратор сравнит номер с данными при оформлении.
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleAddCard}
                                                disabled={isSubmittingCard}
                                                className="flex-1 bg-[var(--primary)] py-2 rounded font-medium text-sm hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50"
                                            >
                                                {isSubmittingCard ? 'Отправка...' : 'Отправить'}
                                            </button>
                                            <button
                                                onClick={() => setIsAddingCard(false)}
                                                className="px-4 py-2 bg-white/10 rounded font-medium text-sm hover:bg-white/20 transition-colors"
                                            >
                                                Отмена
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-white/70 mb-3 text-sm">У вас есть скидочная карта?</p>
                                        <button
                                            onClick={() => setIsAddingCard(true)}
                                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg flex items-center gap-2 hover:bg-white/20 transition-all font-medium text-sm"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Добавить карту</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Menu sections */}
            <div className="px-4 space-y-3">
                {menuSections.map((section, si) => (
                    <motion.div
                        key={si}
                        className="rounded-[var(--radius-lg)] bg-white/60 overflow-hidden"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 + si * 0.08 }}
                    >
                        {section.items.map((item, ii) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-[var(--primary-light)]/20 ${ii < section.items.length - 1 ? 'border-b border-[var(--background)]' : ''
                                        }`}
                                >
                                    <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--primary-light)]/30 flex items-center justify-center">
                                        <Icon className="w-4.5 h-4.5 text-[var(--primary)]" />
                                    </div>
                                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                                    {item.badge && (
                                        <span className="text-xs font-bold text-[var(--primary)] bg-[var(--primary-light)]/40 px-2 py-0.5 rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                    <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
                                </Link>
                            );
                        })}
                    </motion.div>
                ))}

                {/* Logout */}
                <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[var(--radius-lg)] bg-white/60 text-[var(--error)] active:bg-red-50 transition-colors"
                >
                    <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-red-50 flex items-center justify-center">
                        <LogOut className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-sm font-medium">Выйти</span>
                </motion.button>
            </div>
        </main>
    );
}
