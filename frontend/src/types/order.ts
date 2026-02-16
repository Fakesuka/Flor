export interface OrderFormData {
    delivery_type: 'pickup' | 'delivery_city' | 'delivery_remote';
    store_id?: number;
    recipient_name: string;
    recipient_phone: string;
    delivery_address?: string;
    delivery_date: string;
    delivery_time: string;
    card_text?: string;
    comment?: string;
}

export interface Order {
    id: number;
    status: 'pending' | 'awaiting_payment' | 'paid' | 'in_progress' | 'ready' | 'delivering' | 'completed' | 'cancelled';
    delivery_type: 'pickup' | 'delivery_city' | 'delivery_remote';
    subtotal: string;
    delivery_fee: string;
    total: string;
    recipient_name: string;
    recipient_phone: string;
    delivery_address?: string;
    delivery_date: string;
    delivery_time: string;
    card_text?: string;
    payment_url?: string;
    is_paid: boolean;
    created_at: string;
    items: OrderItem[];
}

export interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    price: string;
}

export const ORDER_STATUS_LABELS: Record<Order['status'], string> = {
    pending: 'Ожидает подтверждения',
    awaiting_payment: 'Ожидает оплаты',
    paid: 'Оплачен',
    in_progress: 'Собирается',
    ready: 'Готов',
    delivering: 'Доставляется',
    completed: 'Завершён',
    cancelled: 'Отменён',
};

export const ORDER_STATUS_COLORS: Record<Order['status'], string> = {
    pending: 'var(--info)',
    awaiting_payment: 'var(--warning)',
    paid: 'var(--success)',
    in_progress: 'var(--primary)',
    ready: 'var(--secondary)',
    delivering: 'var(--primary)',
    completed: 'var(--success)',
    cancelled: 'var(--error)',
};

export interface DeliverySettings {
    city_price: string;
    remote_price: string;
    free_delivery_threshold: string;
}
