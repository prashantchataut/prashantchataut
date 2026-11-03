import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { posts } from '@/data/posts';
import ReadingAtmosphere from '@/components/reading/ReadingAtmosphere';
export function generateStaticParams() { return posts.map(({ slug }) => ({ slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
 const post = posts.find(item => item.slug === params.slug); if (!post) return {title:'Not Found'};
 return {title:`${post.title} - Prashant Chataut`,description:post.excerpt,alternates:{canonical:`https://knowprashant.vercel.app/writes/${post.slug}`}};
}
export default function WritePost({ params }: { params: { slug: string } }) {
 const post=posts.find(item=>item.slug===params.slug); if(!post) notFound();
 return <article className={`reading-page reading-${post.theme}`}><ReadingAtmosphere theme={post.theme}/><header className="reading-header"><div className="reading-header-inner"><a href="/writes" className="back-link">← All writing</a><p className="reading-kind">{post.kind}</p><h1 className="reading-title">{post.title}</h1><p className="reading-byline">By Prashant Chataut</p></div></header><div className={`reading-body ${post.theme==='grace'?'poem-body':''}`}>{post.body.map((paragraph,index)=><div className="reading-passage" key={index}><span className="passage-mark" aria-hidden="true"/><p>{paragraph}</p>{index===2 && <figure className="reading-vignette"><img className="vignette-day" src={`/images/${post.theme}-vignette.svg`} alt="" loading="lazy" /><img className="vignette-night" src={`/images/${post.theme}-vignette-night.svg`} alt="" loading="lazy" /></figure>}</div>)}</div><div className="reading-end"><div className="reading-end-mark" aria-hidden="true" /><a href="/writes" className="text-link">More writing <span aria-hidden="true">↗</span></a></div></article>;
}
