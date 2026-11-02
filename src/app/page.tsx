import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Writes - Prashant Chataut',
    description: 'Short notes on apps and building.',
    alternates: { canonical: 'https://knowprashant.vercel.app/writes' },
};

const posts = [
    {
        slug: 'honestly-blogs-are-boring',
        title: 'Most blogs are boring.',
        date: '2026-05-27',
        excerpt: "I don't write for SEO. These are notes I didn't want to lose.",
    },
    {
        slug: 'software-should-shut-up',
        title: 'Apps should shut up.',
        date: '2026-05-27',
        excerpt: 'Notifications, streaks, badges for opening the app. I build away from that.',
    },
    {
        slug: 'building-nebians',
        title: 'Building NEBians.',
        date: '2026-07-23',
        excerpt: 'Notes and past papers were stuck in chats. So we made a place for them.',
    },
];

export default function WritesPage() {
    return (
        <section className="subpage"><p className="section-label">Thoughts along the way</p><h1>Notes.</h1><p className="intro">Short notes on making things and paying attention.</p><div className="note-list">{posts.map(post => <Link key={post.slug} href={`/writes/${post.slug}`} className="note-item"><time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time><h2>{post.title}</h2><p>{post.excerpt}</p></Link>)}</div></section>
    );
}
