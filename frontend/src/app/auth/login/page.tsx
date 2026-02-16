'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, ArrowRight, Loader2, Phone, Lock } from 'lucide-react';
import Link from 'next/link';
import { loginUser } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Strings } from '@/lib/strings';
import { normalizePhone } from '@/lib/phone';

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((s) => s.login);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        phone: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { phone, password } = formData;
            const username = normalizePhone(phone);

            // Login
            const loginRes = await loginUser({
                username,
                password
            });

            // Explicitly fetch me using the new token
            const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/auth/me/`, {
                headers: {
                    Authorization: `Bearer ${loginRes.access}`
                }
            });

            if (!meRes.ok) throw new Error('Failed to fetch user');
            const userData = await meRes.json();

            login(userData, loginRes.access, loginRes.refresh);
            router.push('/profile');
            router.refresh();

        } catch (err: unknown) {
            console.error(err);
            setError('Неверный телефон или пароль.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[var(--surface)] p-8 rounded-2xl shadow-lg border border-[var(--primary-light)]/20"
            >
                <div className="w-20 h-20 bg-[var(--primary-light)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="w-10 h-10 text-[var(--primary)]" />
                </div>

                <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                    Вход
                </h1>

                <p className="text-[var(--text-secondary)] mb-8">
                    Войдите в свой профиль
                </p>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4 text-left">
                    {/* Phone */}
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] w-5 h-5" />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Телефон (+7...)"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-[var(--text-secondary)]/20 bg-white/50 focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] w-5 h-5" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-[var(--text-secondary)]/20 bg-white/50 focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 mt-6 bg-[var(--primary)] text-white rounded-xl font-bold text-lg shadow-lg shadow-[var(--primary)]/30 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <span>Войти</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-sm text-[var(--text-secondary)]">
                    Нет аккаунта?{' '}
                    <Link href="/auth/register" className="text-[var(--primary)] font-medium hover:underline">
                        Зарегистрироваться
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
