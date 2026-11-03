import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { posts } from '@/data/posts';

export function generateStaticParams() { return posts.map(({ slug }) => ({ slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const post = posts.find(item => item.slug === params.slug);
    if (!post) return { title: 'Not Found' };
    return { title: `${post.title} - Prashant Chataut`, description: post.excerpt, alternates: { canonical: `https://knowprashant.vercel.app/writes/${post.slug}` } };
}
export default function WritePost({ params }: { params: { slug: string } }) {
    const post = posts.find(item => item.slug === params.slug);
    if (!post) notFound();
    return <article className={`reading-page reading-${post.theme}`}><header className="reading-header"><div className="reading-header-inner"><a href="/writes" className="back-link">← All writing</a><p className="reading-kind">{post.kind}</p><h1>{post.title}</h1><p className="reading-byline">By Prashant Chataut</p></div></header><div className={`reading-body ${post.theme === 'grace' ? 'poem-body' : ''}`}>{post.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><div className="reading-end"><a href="/writes" className="text-link">More writing <span aria-hidden="true">↗</span></a></div></article>;
}
