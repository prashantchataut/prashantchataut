import sharp from 'sharp';
import { posts } from '@/data/posts';
import { coverCard } from '@/lib/og';

/*
 * The share card for a piece of writing, served as a JPEG. The cover art is painterly, so JPEG keeps each card
 * well under the ~300KB that WhatsApp and other apps expect, where the same card as PNG is several times that.
 */
export const dynamic = 'force-static';

export function generateStaticParams() {
    return posts.map(({ slug }) => ({ slug }));
}

const INK = { grace: '#1f3a42', journey: '#233d2e' } as const;
type Params = { slug: string };

export async function GET(_req: Request, ctx: { params: Params | Promise<Params> }) {
    const { slug } = await Promise.resolve(ctx.params);
    const post = posts.find((p) => p.slug === slug);
    if (!post) return new Response('Not found', { status: 404 });
    const png = Buffer.from(
        await (
            await coverCard({
                image: post.theme === 'grace' ? 'grace' : 'journey',
                kind: post.kind,
                title: post.title,
                ink: INK[post.theme as keyof typeof INK] ?? '#1f3a42',
                url: `knowprashant.vercel.app/writes/${post.slug}`,
            })
        ).arrayBuffer(),
    );
    const jpg = await sharp(png).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
    return new Response(new Uint8Array(jpg), {
        headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' },
    });
}
