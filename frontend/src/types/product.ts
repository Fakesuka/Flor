export interface ProductImage {
    id: number;
    image: string;
    is_primary: boolean;
    order: number;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    image: string;
    order: number;
    products_count: number;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: string;
    discount_price: string | null;
    is_popular: boolean;
    is_new: boolean;
    category: number | Category;
    category_name?: string;
    primary_image?: ProductImage | null;
    images?: ProductImage[];
    availability?: { store: number; store_name: string; quantity: number }[];
    created_at?: string;
}
