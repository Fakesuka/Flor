import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import '../styles/globals.css';
import BottomNav from '@/components/layout/BottomNav';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], variable: '--font-playfair' });
const cormorant = Cormorant_Garamond({ subsets: ['latin', 'cyrillic'], weight: ['400', '600', '700'], variable: '--font-cormorant' });

export const viewport: Viewport = {
    themeColor: '#C4937A',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    viewportFit: 'cover',
};

export const metadata: Metadata = {
    title: {
        default: 'Цветочная Лавка — Свежие букеты с доставкой',
        template: '%s | Цветочная Лавка',
    },
    description: 'Свежие букеты и цветочные композиции с доставкой. Создайте свой уникальный букет в нашем конструкторе.',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Цветочная Лавка',
    },
    openGraph: {
        type: 'website',
        locale: 'ru_RU',
        url: 'https://flower-shop.ru',
        siteName: 'Цветочная Лавка',
        title: 'Цветочная Лавка — Свежие букеты с доставкой',
        description: 'Свежие букеты и цветочные композиции с доставкой. Создайте свой уникальный букет.',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Цветочная Лавка',
        description: 'Свежие букеты и цветочные композиции с доставкой',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Цветочная Лавка',
        image: 'https://flower-shop.ru/icon.png',
        '@id': 'https://flower-shop.ru',
        url: 'https://flower-shop.ru',
        telephone: '+79991234567',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'ул. Цветочная, 1',
            addressLocality: 'Москва',
            postalCode: '101000',
            addressCountry: 'RU',
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
            ],
            opens: '09:00',
            closes: '21:00',
        },
        priceRange: '$$',
    };

    return (
        <html lang="ru" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
            <body>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                {children}
                <BottomNav />
            </body>
        </html>
    );
}
