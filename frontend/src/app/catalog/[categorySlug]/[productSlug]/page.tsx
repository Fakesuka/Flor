import { Metadata } from 'next';
import { getProduct } from '@/lib/api';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        categorySlug: string;
        productSlug: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { productSlug } = await params;
        const product = await getProduct(productSlug);

        const price = product.discount_price || product.price;

        return {
            title: `${product.name} | Купить за ${price} ₽ | Цветочная Лавка`,
            description: product.description || `Купить ${product.name} в Цветочной Лавке.`,
            openGraph: {
                title: product.name,
                description: product.description,
                images: [
                    {
                        url: product.primary_image?.image || '/images/placeholder.jpg',
                        width: 800,
                        height: 800,
                        alt: product.name,
                    },
                ],
            },
        };
    } catch (e) {
        return {
            title: 'Товар не найден',
        };
    }
}

export default async function ProductDetailPage({ params }: Props) {
    const { categorySlug, productSlug } = await params;
    let product;
    try {
        product = await getProduct(productSlug);
    } catch (e) {
        notFound();
    }

    const price = product.discount_price || product.price;

    // JSON-LD for Schema.org
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.primary_image?.image || '/images/placeholder.jpg',
        description: product.description,
        sku: product.id.toString(),
        offers: {
            '@type': 'Offer',
            price: price,
            priceCurrency: 'RUB',
            availability: 'https://schema.org/InStock',
            url: `https://flower-shop.ru/catalog/${categorySlug}/${productSlug}`,
            seller: {
                '@type': 'Florist',
                name: 'Цветочная Лавка',
            },
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailClient product={product} />
        </>
    );
}
