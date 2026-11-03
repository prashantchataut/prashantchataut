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
    return <article className="subpage"><a href="/writes" className="back-link">← All notes</a><time className="article-time" dateTime={post.date}>{new Date(`${post.date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time><h1>{post.title}</h1><div className="article-body">{post.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></article>;
}
