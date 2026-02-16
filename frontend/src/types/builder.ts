export interface BouquetComponent {
    id: number;
    name: string;
    component_type: 'flower' | 'greenery' | 'wrap' | 'ribbon' | 'accessory' | 'paper';
    price: string;
    image: string;
    color: string;
}

export interface BuilderSelection {
    component: BouquetComponent;
    quantity: number;
}

export interface ColorPalette {
    id: string;
    name: string;
    colors: string[];
}

export interface CustomBouquet {
    id: number;
    status: 'draft' | 'pending' | 'priced' | 'approved' | 'ordered' | 'cancelled';
    is_from_photo: boolean;
    reference_photo?: string;
    customer_notes: string;
    budget_min?: string;
    budget_max?: string;
    estimated_price?: string;
    florist_price?: string;
    florist_comment?: string;
    bouquet_items: CustomBouquetItem[];
    created_at: string;
}

export interface CustomBouquetItem {
    id: number;
    component: number;
    component_name: string;
    component_price: string;
    component_image: string;
    quantity: number;
}

export type BuilderStep = 'flowers' | 'greenery' | 'wrap' | 'ribbon' | 'color' | 'paper' | 'preview' | 'done';

export const BUILDER_STEPS: { key: BuilderStep; label: string; emoji: string }[] = [
    { key: 'flowers', label: 'Цветы', emoji: '🌹' },
    { key: 'greenery', label: 'Зелень', emoji: '🌿' },
    { key: 'wrap', label: 'Обёртка', emoji: '🎀' },
    { key: 'ribbon', label: 'Лента', emoji: '🎗️' },
    { key: 'color', label: 'Гамма', emoji: '🎨' },
    { key: 'paper', label: 'Бумага', emoji: '📜' },
    { key: 'preview', label: 'Превью', emoji: '👁️' },
    { key: 'done', label: 'Готово', emoji: '✅' },
];
