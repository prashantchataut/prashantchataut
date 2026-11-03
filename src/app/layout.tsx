import type { Metadata } from 'next';
import { Sora, Libre_Baskerville, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CursorButterflies } from '@/components/garden/Butterflies';

const sora = Sora({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
});

const libreBaskerville = Libre_Baskerville({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-serif',
    display: 'swap',
});

const notoDevanagari = Noto_Sans_Devanagari({
    weight: ['400', '700'],
    subsets: ['devanagari'],
    variable: '--font-devanagari',
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://knowprashant.vercel.app'),
    title: 'Prashant Chataut',
    description:
        'Prashant Chataut builds NEBians, Kairos, and Retra from Nepal. Study apps, a GBA emulator, and quiet journaling.',
    keywords: [
        'Prashant Chataut',
        'NEBians',
        'Retra',
        'Kairos',
        'developer Nepal',
        'study platform',
    ],
    authors: [{ name: 'Prashant Chataut' }],
    creator: 'Prashant Chataut',
    icons: { icon: '/favicon.svg' },
    openGraph: {
        title: 'Prashant Chataut',
        description: 'Builds NEBians, Kairos, and Retra. Apps for learning, words, and play.',
        url: 'https://knowprashant.vercel.app',
        siteName: 'Prashant Chataut',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
    },
    alternates: {
        canonical: 'https://knowprashant.vercel.app',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': 'https://knowprashant.vercel.app/#website',
                url: 'https://knowprashant.vercel.app',
                name: 'Prashant Chataut',
                description:
                    'Prashant Chataut builds NEBians, Kairos, and Retra from Nepal.',
            },
            {
                '@type': 'Person',
                '@id': 'https://knowprashant.vercel.app/#person',
                name: 'Prashant Chataut',
                url: 'https://knowprashant.vercel.app',
                sameAs: [
                    'https://github.com/prashantchataut',
                    'https://instagram.com/prashantchataut_',
                ],
                jobTitle: 'Developer',
                description: 'Builds NEBians, Kairos, and Retra from Nepal.',
                knowsAbout: [
                    'Mobile Development',
                    'Product Design',
                    'Education Technology',
                    'Android',
                    'React Native',
                ],
            },
            {
                '@type': 'SoftwareApplication',
                name: 'NEBians',
                applicationCategory: 'EducationalApplication',
                operatingSystem: 'Android, Web',
                description:
                    'Study notes, past papers, and forums for students, teachers, and institutes.',
                url: 'https://nebians.consica.com.np/',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                },
            },
        ],
    };

    return (
        <html lang="en" className={`${sora.variable} ${libreBaskerville.variable} ${notoDevanagari.variable}`}>
            <head>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            </head>
            <body className="antialiased">
                <a href="#main-content" className="skip-to-content">Skip to content</a>
                    <CursorButterflies />
                    <Header />
                    <main id="main-content" className="relative z-10 min-h-screen">
                        {children}
                    </main>
                    <Footer />
            </body>
        </html>
    );
}
