import type { Metadata } from 'next';
import Link from 'next/link';
import { posts } from '@/data/posts';
import { firstLine, readingMinutes } from '@/lib/reading';

export const metadata: Metadata = {
    title: 'Writing | Prashant Chataut',
    description: 'A poem and a story by Prashant Chataut.',
    alternates: { canonical: 'https://knowprashant.vercel.app/writes' },
    openGraph: { title: 'Writing | Prashant Chataut', description: 'A poem and a story by Prashant Chataut.', url: 'https://knowprashant.vercel.app/writes', type: 'website' },
};

export default function WritesPage() {
    return (
        <section className="writing-index section-wrap">
            <div className="writing-intro">
                <h1>Writing.</h1>
                <p>Poems and notes on making things.</p>
            </div>
            <div className="writing-collection">
                {posts.map((post, i) => (
                    <Link key={post.slug} href={`/writes/${post.slug}`} className={`writing-entry writing-entry-${post.theme} wr-entry`} data-flip={i % 2 === 1}>
                        <div className="writing-entry-copy">
                            <p>{post.kind}, {readingMinutes(post)} min read</p>
                            <h2>{post.title}</h2>
                            <p className="wr-line">“{firstLine(post)}…”</p>
                            <p>{post.excerpt}</p>
                            <span>Read {post.kind.toLowerCase()} <span aria-hidden="true">↗</span></span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
