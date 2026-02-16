'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Truck, Clock, MessageSquare, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const stores = [
    { id: 1, name: 'ТЦ Цветочный', address: 'ул. Ленина, 25' },
    { id: 2, name: 'ТЦ Розмарин', address: 'пр. Мира, 14' },
];

const timeSlots = [
    'Как можно скорее', '10:00 – 12:00', '12:00 – 14:00',
    '14:00 – 16:00', '16:00 – 18:00', '18:00 – 20:00',
];

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="text-2xl">💐</span></div>}>
            <CheckoutContent />
        </Suspense>
    );
}

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { items, totalPrice, clearCart, totalItems } = useCartStore();
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1); // 1: delivery details, 2: recipient

    const deliveryType = searchParams.get('delivery') || 'city';
    const deliveryFee = parseInt(searchParams.get('fee') || '250', 10);
    const subtotal = totalPrice();
    const total = subtotal + deliveryFee;
    const isPickup = deliveryType === 'pickup';

    const [form, setForm] = useState({
        store_id: undefined as number | undefined,
        recipient_name: '',
        recipient_phone: '',
        delivery_address: '',
        delivery_date: new Date().toISOString().slice(0, 10),
        delivery_time: 'Как можно скорее',
        card_text: '',
        comment: '',
    });

    const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        // Simulate API call
        await new Promise((r) => setTimeout(r, 1500));
        clearCart();
        router.push('/order-success');
    };

    return (
        <main className="min-h-screen pb-32">
            {/* Header */}
            <div className="sticky top-0 z-40 glass px-4 py-3">
                <div className="flex items-center gap-3">
                    <Link href="/cart" className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                        Оформление
                    </h1>
                </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 px-6 py-4">
                {[1, 2].map((s) => (
                    <div key={s} className="flex items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? 'bg-[var(--primary)] text-white' : 'bg-[var(--background)] text-[var(--text-secondary)]'
                            }`}>
                            {step > s ? <Check className="w-4 h-4" /> : s}
                        </div>
                        {s < 2 && <div className={`flex-1 h-0.5 mx-2 transition-colors ${step > s ? 'bg-[var(--primary)]' : 'bg-[var(--background)]'}`} />}
                    </div>
                ))}
            </div>

            {/* Step 1: Delivery details */}
            {step === 1 && (
                <motion.div
                    className="px-4 space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                        {isPickup ? 'Самовывоз' : 'Доставка'}
                    </h2>

                    {/* Delivery info badge */}
                    <div className="rounded-[var(--radius-lg)] bg-[var(--primary-light)]/20 p-3 flex items-center gap-2">
                        {isPickup ? <MapPin className="w-5 h-5 text-[var(--primary)]" /> : <Truck className="w-5 h-5 text-[var(--primary)]" />}
                        <span className="text-sm font-medium">
                            {isPickup ? 'Бесплатно' : `${deliveryFee} ₽`}
                        </span>
                    </div>

                    {/* Pickup store or delivery address */}
                    {isPickup ? (
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Выберите магазин</p>
                            {stores.map((store) => (
                                <button
                                    key={store.id}
                                    onClick={() => updateField('store_id', store.id)}
                                    className={`w-full text-left p-4 rounded-[var(--radius-lg)] border transition-all ${form.store_id === store.id
                                        ? 'border-[var(--primary)] bg-[var(--primary-light)]/20'
                                        : 'border-transparent bg-white/50'
                                        }`}
                                >
                                    <p className="font-medium text-sm">{store.name}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">{store.address}</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <Input
                            label="Адрес доставки"
                            placeholder="ул. Цветочная, 1, кв. 5"
                            value={form.delivery_address}
                            onChange={(e) => updateField('delivery_address', e.target.value)}
                        />
                    )}

                    {/* Date & Time */}
                    <Input
                        label="Дата"
                        type="date"
                        value={form.delivery_date}
                        onChange={(e) => updateField('delivery_date', e.target.value)}
                    />
                    <div>
                        <p className="text-sm font-medium mb-2">Время</p>
                        <div className="flex flex-wrap gap-2">
                            {timeSlots.map((slot) => (
                                <button
                                    key={slot}
                                    onClick={() => updateField('delivery_time', slot)}
                                    className={`px-3 py-2 rounded-full text-xs font-medium transition-all ${form.delivery_time === slot
                                        ? 'bg-[var(--primary)] text-white'
                                        : 'bg-white/50 text-[var(--text-secondary)]'
                                        }`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button size="lg" className="w-full mt-4" onClick={() => setStep(2)}>
                        Далее
                    </Button>
                </motion.div>
            )}

            {/* Step 2: Recipient + confirmation */}
            {step === 2 && (
                <motion.div
                    className="px-4 space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                        Получатель
                    </h2>

                    <Input
                        label="Имя получателя"
                        placeholder="Анна"
                        value={form.recipient_name}
                        onChange={(e) => updateField('recipient_name', e.target.value)}
                    />
                    <Input
                        label="Телефон получателя"
                        placeholder="+7 (900) 123-45-67"
                        value={form.recipient_phone}
                        onChange={(e) => updateField('recipient_phone', e.target.value)}
                    />

                    <div>
                        <label className="text-sm font-medium mb-1.5 block">
                            <MessageSquare className="w-4 h-4 inline mr-1" />
                            Текст открытки
                        </label>
                        <textarea
                            placeholder="Поздравляю с днём рождения! 🎉"
                            value={form.card_text}
                            onChange={(e) => updateField('card_text', e.target.value)}
                            className="w-full h-24 rounded-2xl border border-input bg-white/50 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>

                    <Input
                        label="Комментарий к заказу"
                        placeholder="Позвонить за 30 минут..."
                        value={form.comment}
                        onChange={(e) => updateField('comment', e.target.value)}
                    />

                    {/* Order summary */}
                    <div className="rounded-[var(--radius-lg)] bg-white/50 p-4 mt-2">
                        <p className="text-sm font-medium mb-2">Ваш заказ</p>
                        {items.map((item) => (
                            <div key={item.product.id} className="flex justify-between text-sm py-1">
                                <span className="text-[var(--text-secondary)]">{item.product.name} ×{item.quantity}</span>
                                <span>{parseFloat(item.product.discount_price || item.product.price) * item.quantity} ₽</span>
                            </div>
                        ))}
                        <div className="flex justify-between text-sm py-1">
                            <span className="text-[var(--text-secondary)]">
                                {isPickup ? 'Самовывоз' : 'Доставка'}
                            </span>
                            <span className={deliveryFee === 0 ? 'text-[var(--success)]' : ''}>
                                {deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee} ₽`}
                            </span>
                        </div>
                        <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                            <span>Итого</span>
                            <span className="text-xl" style={{ fontFamily: 'var(--font-accent)' }}>{total} ₽</span>
                        </div>
                    </div>

                    {/* Payment info */}
                    <div className="rounded-[var(--radius-lg)] bg-[var(--info)]/10 p-3 text-xs text-[var(--text-secondary)] leading-relaxed">
                        💳 После оформления заказ поступит флористу. Когда он подтвердит заказ, вам придёт ссылка на оплату.
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>
                            Назад
                        </Button>
                        <Button size="lg" className="flex-1" onClick={handleSubmit} isLoading={submitting}>
                            Отправить заказ
                        </Button>
                    </div>
                </motion.div>
            )}
        </main>
    );
}
