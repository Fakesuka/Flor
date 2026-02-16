import type { Product, Category } from '@/types/product';

// Mock Data — used until backend is running
export const mockCategories: Category[] = [
    { id: 1, name: 'Букеты', slug: 'bouquets', icon: '💐', image: '', order: 1, products_count: 12 },
    { id: 2, name: 'Комнатные растения', slug: 'indoor-plants', icon: '🪴', image: '', order: 2, products_count: 8 },
    { id: 3, name: 'Шары', slug: 'balloons', icon: '🎈', image: '', order: 3, products_count: 5 },
    { id: 4, name: 'Подарки', slug: 'gifts', icon: '🎁', image: '', order: 4, products_count: 10 },
    { id: 5, name: 'Упаковка', slug: 'packaging', icon: '🎀', image: '', order: 5, products_count: 6 },
    { id: 6, name: 'Свадьба', slug: 'wedding', icon: '💍', image: '', order: 6, products_count: 9 },
];

const createProduct = (id: number, name: string, price: number, opts: Partial<Product> = {}): Product => ({
    id,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    description: `Прекрасный ${name.toLowerCase()} в нашем исполнении`,
    price: price.toString(),
    discount_price: null,
    is_popular: false,
    is_new: false,
    category: 1,
    primary_image: null,
    ...opts,
});

export const mockProducts: Product[] = [
    createProduct(1, 'Нежность', 3500, { is_popular: true }),
    createProduct(2, 'Весенний рассвет', 4200, { is_popular: true, discount_price: '3800' }),
    createProduct(3, 'Солнечный день', 2800, { is_popular: true, is_new: true }),
    createProduct(4, 'Романтика', 5500, { is_popular: true }),
    createProduct(5, 'Лавандовый сон', 4800, { is_new: true }),
    createProduct(6, 'Весна в Париже', 6200, { is_new: true }),
    createProduct(7, 'Утренняя дымка', 3200, { is_new: true }),
    createProduct(8, 'Пион микс', 7500, { is_popular: true }),
    createProduct(9, 'Хлопок и эвкалипт', 4100, { category: 2 }),
    createProduct(10, 'Монстера', 3900, { category: 2, is_new: true }),
    createProduct(11, 'Сукулент микс', 1800, { category: 2 }),
    createProduct(12, 'Кактус Арт', 2200, { category: 2 }),
];
