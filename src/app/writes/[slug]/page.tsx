import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { posts } from '@/data/posts';
import { readingMinutes } from '@/lib/reading';
import ReadingAtmosphere from '@/components/reading/ReadingAtmosphere';
import ShareBar from '@/components/reading/ShareBar';
import MarginArt from '@/components/reading/MarginArt';

type Params = { slug: string };
type Props = { params: Params | Promise<Params> };

const ORIGIN = 'https://knowprashant.vercel.app';

export function generateStaticParams() {
    return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await Promise.resolve(params);
    const post = posts.find((item) => item.slug === slug);
    if (!post) return { title: 'Not Found' };
    const url = `${ORIGIN}/writes/${post.slug}`;
    const title = `${post.title} | Prashant Chataut`;
    const card = { url: `${ORIGIN}/writes/${post.slug}/og.jpg`, width: 1200, height: 630, type: 'image/jpeg', alt: `Cover art for ${post.title}` };
    return {
        title,
        description: post.excerpt,
        alternates: { canonical: url },
        openGraph: { type: 'article', url, title, description: post.excerpt, siteName: 'Prashant Chataut', authors: ['Prashant Chataut'], images: [card] },
        twitter: { card: 'summary_large_image', title, description: post.excerpt, images: [card.url] },
    };
}

export default async function WritePost({ params }: Props) {
    const { slug } = await Promise.resolve(params);
    const index = posts.findIndex((item) => item.slug === slug);
    if (index < 0) notFound();
    const post = posts[index];
    const next = posts[(index + 1) % posts.length];
    const minutes = readingMinutes(post);
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: post.title,
        description: post.excerpt,
        genre: post.kind,
        url: `${ORIGIN}/writes/${post.slug}`,
        author: { '@type': 'Person', name: 'Prashant Chataut', url: ORIGIN },
        image: `${ORIGIN}/writes/${post.slug}/og.jpg`,
    };
    return (
        <article className={`reading-page reading-${post.theme}`}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ReadingAtmosphere theme={post.theme} />
            <header className="reading-header">
                <div className="reading-header-inner">
                    <a href="/writes" className="back-link">← All writing</a>
                    <p className="reading-kind">{post.kind}</p>
                    <h1 className="reading-title">{post.title}</h1>
                    <p className="reading-byline">By Prashant Chataut, {minutes} min read</p>
                </div>
            </header>
            <div className={`reading-body ${post.theme === 'grace' ? 'poem-body' : ''}`}>
                {post.body.map((paragraph, i) => (
                    <div className="reading-passage" key={i}>
                        <MarginArt theme={post.theme} index={i} />
                        <span className="passage-mark" aria-hidden="true" />
                        <p>{paragraph}</p>
                    </div>
                ))}
            </div>
            <div className="reading-end">
                <div className="reading-end-mark" aria-hidden="true" />
                <ShareBar title={post.title} path={`/writes/${post.slug}`} />
                <Link href={`/writes/${next.slug}`} className={`next-piece writing-entry writing-entry-${next.theme}`}>
                    <span className="next-piece-copy">
                        <span>Next, a {next.kind.toLowerCase()}</span>
                        <strong>{next.title}</strong>
                        <em>{next.excerpt}</em>
                    </span>
                </Link>
            </div>
        </article>
    );
}
