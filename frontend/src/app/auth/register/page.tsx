'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, ArrowRight, Loader2, Phone, Lock, Type } from 'lucide-react';
import Link from 'next/link';
import { registerUser, loginUser } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Strings } from '@/lib/strings';
import { normalizePhone } from '@/lib/phone';

export default function RegisterPage() {
    const router = useRouter();
    const login = useAuthStore((s) => s.login);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { name, phone, password } = formData;
            // Username generation (unique)
            const username = normalizePhone(phone);

            // 1. Register
            await registerUser({
                username,
                password: password || '123456',
                phone,
                first_name: name,
            });

            // 2. Login
            const loginRes = await loginUser({
                username,
                password: password || '123456'
            });

            // 3. Save to store
            login({
                id: Date.now(), // Temporary ID until we fetch me
                username,
                role: 'client',
                first_name: name,
                phone
            }, loginRes.access, loginRes.refresh);

            // 4. Redirect
            router.push('/profile');

        } catch (err: unknown) {
            console.error(err);
            // Handle specific errors (e.g., user exists)
            setError('Ошибка регистрации. Возможно, пользователь с таким телефоном уже существует.');
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
                    Регистрация
                </h1>

                <p className="text-[var(--text-secondary)] mb-8">
                    Заполните данные для создания профиля
                </p>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegistration} className="space-y-4 text-left">
                    {/* Name */}
                    <div className="relative">
                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] w-5 h-5" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Ваше имя"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-[var(--text-secondary)]/20 bg-white/50 focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                        />
                    </div>

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
                                <span>Зарегистрироваться</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-sm text-[var(--text-secondary)]">
                    Уже есть аккаунт?{' '}
                    <Link href="/auth/login" className="text-[var(--primary)] font-medium hover:underline">
                        Войти
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
