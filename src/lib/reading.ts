import { posts } from '@/data/posts';

export type Post = (typeof posts)[number];

/** Whole minutes to read a piece, never less than one. */
export function readingMinutes(post: Post) {
    const words = post.body.join(' ').split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
}

/** The opening line of a piece, as a quiet preview. */
export function firstLine(post: Post) {
    return post.body[0].split('\n')[0].replace(/,$/, '');
}
