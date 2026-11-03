import type { Metadata } from 'next';
import Link from 'next/link';
import { posts } from '@/data/posts';

export const metadata: Metadata = { title: 'Notes - Prashant Chataut', description: 'Notes on building apps, learning, and paying attention.', alternates: { canonical: 'https://knowprashant.vercel.app/writes' } };
export default function WritesPage() {
    return <section className="subpage"><h1>Notes from the work.</h1><p className="intro">A few thoughts on making things, learning, and paying attention.</p><div className="note-list">{[...posts].reverse().map(post => <Link key={post.slug} href={`/writes/${post.slug}`} className="note-item"><time dateTime={post.date}>{new Date(`${post.date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time><h2>{post.title}</h2><p>{post.excerpt}</p></Link>)}</div></section>;
}
