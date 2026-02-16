import CategoryCard from '@/components/product/CategoryCard';
import { getCategories } from '@/lib/api';

export const dynamic = 'force-dynamic';
import { Strings } from '@/lib/strings';
import { Search } from 'lucide-react';
import type { Category } from '@/types/product';

export const metadata = {
    title: 'Каталог | Цветочная Лавка',
    description: 'Свежие букеты и композиции',
};

export default async function CatalogPage() {
    let categories = [];

    try {
        const categoriesData = await getCategories();
        categories = categoriesData.results || categoriesData;
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }

    return (
        <main className="min-h-screen">
            {/* Header */}
            <header className="bg-[var(--primary-light)]/30 pt-32 pb-16 px-4">
                <div className="container mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                        {Strings.catalogTitle || 'Каталог'}
                    </h1>

                    {/* Search Bar */}
                    <div className="relative max-w-xl">
                        <input
                            type="text"
                            placeholder={Strings.searchPlaceholder || 'Поиск...'}
                            className="w-full h-12 pl-12 pr-4 rounded-full border-none shadow-md focus:ring-2 focus:ring-[var(--primary)] text-[var(--text-primary)]"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] w-5 h-5" />
                    </div>
                </div>
            </header>

            {/* Categories */}
            <section className="py-12 container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categories.length > 0 ? (
                        categories.map((category: Category, i: number) => (
                            <div key={category.id} className="aspect-square">
                                <CategoryCard category={category} index={i} />
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-[var(--text-secondary)]">
                            Категории не найдены.
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}
