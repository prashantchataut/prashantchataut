import { siteCard, OG_SIZE } from '@/lib/og';

export const alt = 'Prashant Chataut, developer from Nepal. A name wrapped in flowers over a meadow with butterflies.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
    return siteCard({
        title: 'Prashant Chataut',
        line: 'Developer from Nepal. I make apps to solve things that matter to me.',
        url: 'knowprashant.vercel.app',
    });
}
