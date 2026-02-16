'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Upload, Image as ImageIcon, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function PhotoBouquetPage() {
    const [photo, setPhoto] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [budgetRange, setBudgetRange] = useState<[number, number]>([2000, 5000]);
    const [submitted, setSubmitted] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPhoto(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        setSubmitted(true);
        // TODO: POST to /api/builder/bouquets/from-photo/
    };

    if (submitted) {
        return (
            <main className="min-h-screen flex items-center justify-center px-6">
                <motion.div
                    className="text-center max-w-sm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <motion.div
                        className="w-20 h-20 rounded-full bg-[var(--success)]/20 flex items-center justify-center mx-auto mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    >
                        <span className="text-4xl">📸</span>
                    </motion.div>

                    <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        Фото отправлено!
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">
                        Флорист изучит ваш пример и предложит цену. Вам придёт уведомление.
                    </p>

                    <div className="flex items-center gap-3 bg-[var(--warning)]/15 rounded-[var(--radius-lg)] px-5 py-3 mb-8">
                        <motion.div
                            className="w-3 h-3 rounded-full bg-[var(--warning)]"
                            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                        <span className="text-sm font-medium">Ожидает оценки флористом</span>
                    </div>

                    <div className="space-y-3">
                        <Link href="/" className="block">
                            <Button size="lg" className="w-full">На главную</Button>
                        </Link>
                        <Link href="/bouquet-builder" className="block">
                            <Button variant="outline" size="lg" className="w-full">
                                Или соберите в конструкторе
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pb-28">
            {/* Header */}
            <div className="sticky top-0 z-40 glass px-4 py-3">
                <div className="flex items-center gap-3">
                    <Link href="/" className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
                    </Link>
                    <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                        Букет по фото
                    </h1>
                </div>
            </div>

            <div className="px-4 mt-4 space-y-6">
                {/* Photo upload */}
                <div>
                    <h2 className="text-base font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                        📷 Загрузите фото-пример
                    </h2>

                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFile}
                        className="hidden"
                    />

                    <AnimatePresence mode="wait">
                        {photo ? (
                            <motion.div
                                key="preview"
                                className="relative rounded-[var(--radius-xl)] overflow-hidden aspect-square"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => setPhoto(null)}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center text-sm"
                                >
                                    ✕
                                </button>
                            </motion.div>
                        ) : (
                            <motion.button
                                key="upload"
                                onClick={() => fileRef.current?.click()}
                                className="w-full aspect-[4/3] rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--primary)] bg-[var(--primary-light)]/20 flex flex-col items-center justify-center gap-3 transition-all active:scale-[0.98]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                whileHover={{ borderColor: 'var(--primary-dark)' }}
                            >
                                <div className="w-16 h-16 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
                                    <Camera className="w-8 h-8 text-[var(--primary)]" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium mb-1">Нажмите для загрузки</p>
                                    <p className="text-xs text-[var(--text-secondary)]">или сделайте фото с камеры</p>
                                </div>
                                <div className="flex gap-4 mt-2">
                                    <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                                        <Upload className="w-3 h-3" /> Загрузить
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                                        <ImageIcon className="w-3 h-3" /> Галерея
                                    </div>
                                </div>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                {/* Budget range */}
                <div>
                    <h2 className="text-base font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                        💰 Бюджет
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 rounded-[var(--radius-md)] bg-white/60 px-4 py-3 text-center">
                            <p className="text-[10px] text-[var(--text-secondary)] mb-1">от</p>
                            <input
                                type="number"
                                value={budgetRange[0]}
                                onChange={(e) => setBudgetRange([+e.target.value, budgetRange[1]])}
                                className="w-full text-center text-lg font-bold bg-transparent outline-none"
                                style={{ fontFamily: 'var(--font-accent)' }}
                            />
                            <p className="text-xs text-[var(--text-secondary)]">₽</p>
                        </div>
                        <span className="text-[var(--text-secondary)]">—</span>
                        <div className="flex-1 rounded-[var(--radius-md)] bg-white/60 px-4 py-3 text-center">
                            <p className="text-[10px] text-[var(--text-secondary)] mb-1">до</p>
                            <input
                                type="number"
                                value={budgetRange[1]}
                                onChange={(e) => setBudgetRange([budgetRange[0], +e.target.value])}
                                className="w-full text-center text-lg font-bold bg-transparent outline-none"
                                style={{ fontFamily: 'var(--font-accent)' }}
                            />
                            <p className="text-xs text-[var(--text-secondary)]">₽</p>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <h2 className="text-base font-bold mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        <MessageSquare className="w-4 h-4" /> Пожелания
                    </h2>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Опишите, что вы хотели бы получить. Например: «Нежные пастельные тона, побольше зелени...»"
                        className="w-full rounded-[var(--radius-lg)] bg-white/60 p-4 text-sm resize-none h-28 outline-none border-2 border-transparent focus:border-[var(--primary)] transition-colors"
                    />
                </div>
            </div>

            {/* Submit button */}
            <div className="fixed bottom-16 left-0 right-0 z-40 glass p-4">
                <Button
                    size="lg"
                    className="w-full gap-2"
                    disabled={!photo}
                    onClick={handleSubmit}
                >
                    <Send className="w-5 h-5" />
                    Отправить флористу
                </Button>
            </div>
        </main>
    );
}
