import { siteConfig } from '@/data/config';
export const metadata = { title: 'Now - Prashant Chataut', description: 'What I’m working on right now.', alternates: { canonical: 'https://knowprashant.vercel.app/now' } };
export default function NowPage() {
    return <section className="subpage"><p className="section-label">A little update</p><h1>Right now.</h1><p className="intro">A look at the things on my mind and in the works.</p><div className="article-body">{siteConfig.now.map((paragraph, i) => <p key={i}>{paragraph}</p>)}<p>Last updated: July 2026</p></div></section>;
}
