import HeroBanner from '@/components/home/HeroBanner';
import ProductScrollSection from '@/components/home/PopularProducts';
import BuildBouquetCTA from '@/components/home/BuildBouquetCTA';
import StoriesRow from '@/components/home/StoriesRow';
import { getProducts, getStories } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    let popularProducts = [];
    let newProducts = [];
    let stories = [];

    try {
        const [popularData, newData, storiesData] = await Promise.all([
            getProducts({ is_popular: true }),
            getProducts({ is_new: true }),
            getStories().catch(() => []),
        ]);
        popularProducts = popularData.results || popularData;
        newProducts = newData.results || newData;
        stories = storiesData.results || storiesData || [];
    } catch (e) {
        console.error('Failed to fetch home data:', e);
    }

    return (
        <main>
            <HeroBanner />

            <StoriesRow stories={stories} />

            {popularProducts.length > 0 && (
                <ProductScrollSection
                    title="Популярное"
                    linkHref="/catalog"
                    products={popularProducts}
                />
            )}

            <BuildBouquetCTA />

            {newProducts.length > 0 && (
                <ProductScrollSection
                    title="Новинки"
                    linkHref="/catalog"
                    products={newProducts}
                />
            )}
        </main>
    );
}
