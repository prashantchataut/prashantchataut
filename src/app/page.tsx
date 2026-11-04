import PixelIcon from '@/components/pixel/PixelIcon';
import Hero from '@/components/home/Hero';
import Projects from '@/components/home/Projects';
import About from '@/components/home/About';
import Link from 'next/link';
import { posts } from '@/data/posts';

export default function Home() {
    return (
        <>
            <Hero />
            <Projects />
            <About />
            <section className="home-writing section-wrap" aria-labelledby="home-writing-title">
                <div><h2 id="home-writing-title">Writing.</h2><p>Poems and notes on making things.</p></div>
                <div className="home-writing-cards">
                    {posts.map(post => (
                        <Link key={post.slug} href={`/writes/${post.slug}`} className={`writing-entry writing-entry-${post.theme} home-card`}>
                            <span className="home-card-copy"><span>{post.kind}</span><strong>{post.title}</strong><em>{post.excerpt}</em><PixelIcon name="right" /></span>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
}
