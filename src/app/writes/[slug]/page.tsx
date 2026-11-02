import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const posts = [
    {
        slug: 'honestly-blogs-are-boring',
        title: 'Most blogs are boring.',
        date: '2026-05-27',
        body: [
            'A lot of online writing exists because someone needed a publish date. You read it, forget it by dinner, and nothing changed.',
            'These pages are the opposite of that goal. I write when I want to pin a thought down. How people learn. Why apps get loud. What it took to ship something.',
            'If you found this from the tiny dot in the footer, cool. If you did not, also cool.',
        ],
    },
    {
        slug: 'software-should-shut-up',
        title: 'Apps should shut up.',
        date: '2026-05-27',
        body: [
            'Apps love to be your friend. Morning pings. Streaks. Badges for opening the app. Pop-ups asking for notifications before you have done anything.',
            'Prody is my answer for journaling: write a bit, reflect if you want, leave. NEBians is similar in spirit. People talking and sharing notes beats a bot yelling at you.',
            'Teams ship noise because the dashboard rewards it. More pings, more "engagement," quieter brains. I am not interested in that loop.',
            'Be useful when someone opens you. Stay quiet when they do not.',
        ],
    },
    {
        slug: 'building-nebians',
        title: 'Building NEBians.',
        date: '2026-07-23',
        body: [
            'Students needed notes and past papers in one place. Most of that lived in chat threads and random folders. Teachers wanted somewhere that felt like theirs.',
            'So we built NEBians: upload resources, talk on the forum, get exam updates. It runs on the web and on Google Play. The win is not the feature list. It is when someone asks a question and gets a real reply.',
            'Neby (the in-app helper) was sounding too stiff, so we are fixing that. Next up from what people asked for: anonymous posts, better media, offline downloads, spaces for tutors and institutes.',
            'Try the app or the site if you care. Feedback from people using it beats any pitch.',
        ],
    },
];

export function generateStaticParams() {
    return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) return { title: 'Not Found' };
    return {
        title: `${post.title} - Prashant Chataut`,
        description: post.body[0].slice(0, 160),
        alternates: { canonical: `https://knowprashant.vercel.app/writes/${post.slug}` },
    };
}

export default function WritePost({ params }: { params: { slug: string } }) {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) notFound();

    return (
        <article className="subpage"><a href="/writes" className="back-link">← All notes</a><time className="article-time" dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time><h1>{post.title}</h1><div className="article-body">{post.body.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div></article>
    );
}
