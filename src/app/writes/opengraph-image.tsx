import { siteCard, OG_SIZE } from '@/lib/og';

export const alt = 'Writing by Prashant Chataut: a poem and a story.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
    return siteCard({
        title: 'Writing.',
        line: 'A poem and a story. Poems and notes on making things.',
        url: 'knowprashant.vercel.app/writes',
    });
}
