'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Camera, User, Phone, Save,
    AlertTriangle, Trash2, ChevronRight, Eye, EyeOff,
    Check, X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { updateProfile, getProfile } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    const { user, login, logout, isAuthenticated } = useAuthStore();
    const isLoggedIn = isAuthenticated();

    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [avatar, setAvatar] = useState<string | null>(null);
    const [showCrop, setShowCrop] = useState(false);
    const [rawImage, setRawImage] = useState<string | null>(null);
    const [cropPosition, setCropPosition] = useState({ x: 0, y: 0, scale: 1 });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // Refresh user data on mount
    useEffect(() => {
        if (!isLoggedIn) return;
        getProfile()
            .then((freshUser) => {
                const { token, refreshToken, login: storeLogin } = useAuthStore.getState();
                if (token && refreshToken) {
                    storeLogin(freshUser, token, refreshToken);
                }
                setFirstName(freshUser.first_name || '');
                setLastName(freshUser.last_name || '');
                setPhone(freshUser.phone || '');
            })
            .catch(() => { });
    }, [isLoggedIn]);

    const displayName = `${firstName} ${lastName}`.trim() || user?.username || '';
    const initials = (displayName || 'U')[0].toUpperCase();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setRawImage(reader.result as string);
                setShowCrop(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const applyCrop = () => {
        setAvatar(rawImage);
        setShowCrop(false);
        setRawImage(null);
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const updatedUser = await updateProfile({
                first_name: firstName,
                last_name: lastName,
                phone: phone,
            });
            const { token, refreshToken } = useAuthStore.getState();
            if (token && refreshToken) {
                login(updatedUser, token, refreshToken);
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (e) {
            setError('Ошибка при сохранении');
            setTimeout(() => setError(null), 3000);
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-screen pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 glass px-4 py-3">
                <div className="flex items-center gap-3">
                    <Link href="/profile" className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
                    </Link>
                    <h1 className="text-xl font-bold flex-1" style={{ fontFamily: 'var(--font-heading)' }}>
                        Настройки
                    </h1>
                </div>
            </div>

            <div className="px-4 mt-6 space-y-6">
                {/* Avatar section */}
                <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="relative mb-3">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[var(--primary-light)] to-[var(--primary)] flex items-center justify-center ring-4 ring-white shadow-lg overflow-hidden">
                            {avatar ? (
                                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                                    {initials}
                                </span>
                            )}
                        </div>

                        {/* Camera button */}
                        <button
                            onClick={() => fileRef.current?.click()}
                            className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-md border-3 border-white"
                        >
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={() => fileRef.current?.click()}
                        className="text-sm text-[var(--primary)] font-medium"
                    >
                        Изменить фото
                    </button>

                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </motion.div>

                {/* Crop modal */}
                <AnimatePresence>
                    {showCrop && rawImage && (
                        <motion.div
                            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white rounded-[var(--radius-xl)] p-4 w-full max-w-sm"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                            >
                                <h3 className="text-lg font-bold mb-3 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Обрезка фото
                                </h3>

                                {/* Preview area */}
                                <div className="relative w-56 h-56 mx-auto rounded-full overflow-hidden bg-gray-100 mb-4 ring-4 ring-[var(--primary-light)]">
                                    <img
                                        src={rawImage}
                                        alt="Crop preview"
                                        className="w-full h-full object-cover"
                                        style={{
                                            transform: `scale(${cropPosition.scale}) translate(${cropPosition.x}px, ${cropPosition.y}px)`,
                                        }}
                                    />
                                </div>

                                {/* Zoom slider */}
                                <div className="mb-4 px-4">
                                    <label className="text-xs text-[var(--text-secondary)] mb-1 block">Масштаб</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        step="0.1"
                                        value={cropPosition.scale}
                                        onChange={(e) =>
                                            setCropPosition((p) => ({ ...p, scale: parseFloat(e.target.value) }))
                                        }
                                        className="w-full accent-[var(--primary)]"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 gap-1"
                                        onClick={() => {
                                            setShowCrop(false);
                                            setRawImage(null);
                                        }}
                                    >
                                        <X className="w-4 h-4" /> Отмена
                                    </Button>
                                    <Button className="flex-1 gap-1" onClick={applyCrop}>
                                        <Check className="w-4 h-4" /> Применить
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Name field */}
                <motion.div
                    className="rounded-[var(--radius-lg)] bg-white/60 p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-2">
                        <User className="w-3.5 h-3.5" /> Имя
                    </label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Имя"
                        className="w-full bg-transparent text-base font-medium outline-none border-b-2 border-transparent focus:border-[var(--primary)] pb-1 transition-colors mb-3"
                    />
                    <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-2">
                        <User className="w-3.5 h-3.5" /> Фамилия
                    </label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Фамилия"
                        className="w-full bg-transparent text-base font-medium outline-none border-b-2 border-transparent focus:border-[var(--primary)] pb-1 transition-colors"
                    />
                </motion.div>

                {/* Phone field */}
                <motion.div
                    className="rounded-[var(--radius-lg)] bg-white/60 p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-2">
                        <Phone className="w-3.5 h-3.5" /> Телефон
                    </label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-transparent text-base font-medium outline-none border-b-2 border-transparent focus:border-[var(--primary)] pb-1 transition-colors"
                    />
                </motion.div>

                {/* Save button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Button size="lg" className="w-full gap-2" onClick={handleSave} disabled={saving}>
                        {saved ? (
                            <>
                                <Check className="w-5 h-5" /> Сохранено!
                            </>
                        ) : saving ? (
                            <>
                                <Save className="w-5 h-5 animate-spin" /> Сохранение...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" /> Сохранить
                            </>
                        )}
                    </Button>
                    {error && (
                        <p className="text-sm text-[var(--error)] text-center mt-2">{error}</p>
                    )}
                </motion.div>

                {/* Divider */}
                <div className="border-t border-[var(--background)] my-2" />

                {/* Notifications setting */}
                <motion.div
                    className="rounded-[var(--radius-lg)] bg-white/60 p-4 space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                        Уведомления
                    </h3>
                    {[
                        { label: 'Статус заказа', default: true },
                        { label: 'Акции и скидки', default: true },
                        { label: 'Новинки', default: false },
                    ].map((setting) => (
                        <NotificationToggle key={setting.label} label={setting.label} defaultOn={setting.default} />
                    ))}
                </motion.div>

                {/* Danger zone */}
                <motion.div
                    className="rounded-[var(--radius-lg)] bg-red-50/60 p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    <h3 className="text-sm font-bold text-[var(--error)] mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Опасная зона
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mb-3">
                        Удаление аккаунта необратимо. Все данные, заказы и бонусы будут потеряны.
                    </p>

                    <AnimatePresence mode="wait">
                        {!showDeleteConfirm ? (
                            <motion.div key="btn" exit={{ opacity: 0 }}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 text-[var(--error)] border-[var(--error)]/30 hover:bg-red-50"
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    <Trash2 className="w-4 h-4" /> Удалить аккаунт
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="confirm"
                                className="space-y-2"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <p className="text-sm font-bold text-[var(--error)]">
                                    Вы уверены? Это действие необратимо!
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => setShowDeleteConfirm(false)}
                                    >
                                        Отмена
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-[var(--error)] hover:bg-red-700"
                                        onClick={() => {
                                            setShowDeleteConfirm(false);
                                            setError('Удаление аккаунта будет доступно в следующем обновлении.');
                                            setTimeout(() => setError(null), 3000);
                                        }}
                                    >
                                        Удалить навсегда
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </main>
    );
}

/* ---- Toggle Component ---- */

function NotificationToggle({ label, defaultOn }: { label: string; defaultOn: boolean }) {
    const [on, setOn] = useState(defaultOn);

    return (
        <div className="flex items-center justify-between">
            <span className="text-sm">{label}</span>
            <button
                onClick={() => setOn(!on)}
                className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${on ? 'bg-[var(--primary)]' : 'bg-gray-300'
                    }`}
            >
                <motion.div
                    className="w-5 h-5 rounded-full bg-white shadow absolute top-0.5"
                    animate={{ left: on ? '22px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
            </button>
        </div>
    );
}
