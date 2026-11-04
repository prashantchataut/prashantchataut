import type { Metadata } from 'next';
import { Sora, Libre_Baskerville, Pixelify_Sans } from 'next/font/google';
import './globals.css';
import './bloom.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CursorButterflies } from '@/components/garden/Butterflies';

const pixelify = Pixelify_Sans({ subsets: ['latin'], variable: '--font-pixel', display: 'swap' });

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

export const metadata: Metadata = {
    metadataBase: new URL('https://knowprashant.vercel.app'),
    title: 'Prashant Chataut',
    description:
        'Prashant Chataut builds NEBians, Kairos, and Retra from Nepal. Apps, client work, and writing from Nepal.',
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
    icons: { icon: '/favicon-pixel.svg' },
    openGraph: {
        title: 'Prashant Chataut',
        description: 'Developer from Nepal. I make apps to solve things that matter to me.',
        url: 'https://knowprashant.vercel.app',
        siteName: 'Prashant Chataut',
        type: 'website',
        locale: 'en',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Prashant Chataut',
        description: 'Developer from Nepal. I make apps to solve things that matter to me.',
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
        <html lang="en" suppressHydrationWarning className={`${sora.variable} ${libreBaskerville.variable} ${pixelify.variable}`}>
            <head>
                <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch(e){}})()` }} />
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
