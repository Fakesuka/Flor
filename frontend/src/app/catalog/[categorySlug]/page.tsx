import { Metadata } from 'next';
import { getCategory, getProducts } from '@/lib/api';
import CategoryClient from '@/components/product/CategoryClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        categorySlug: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { categorySlug } = await params;
        const category = await getCategory(categorySlug);
        return {
            title: `${category.name} | Купить цветы`,
            description: `Категория ${category.name}.`,
        };
    } catch {
        return { title: 'Категория не найдена' };
    }
}

export default async function CategoryPage({ params }: Props) {
    const { categorySlug } = await params;
    let category;
    let products = [];

    try {
        category = await getCategory(categorySlug);
        if (category) {
            const productsData = await getProducts({ category: category.id });
            products = productsData.results || productsData;
        }
    } catch (e) {
        // Fallback or 404
    }

    // JSON-LD for Breadcrumb
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Каталог',
                item: 'https://flower-shop.ru/catalog',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: category?.name,
                item: `https://flower-shop.ru/catalog/${categorySlug}`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryClient category={category} initialProducts={products} />
        </>
    );
}
