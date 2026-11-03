import Hero from '@/components/home/Hero';
import Projects from '@/components/home/Projects';
import About from '@/components/home/About';
import Link from 'next/link';

export default function Home() {
    return (
        <>
            <Hero />
            <Projects />
            <About />
            <section className="home-writing section-wrap" aria-labelledby="home-writing-title">
                <div><h2 id="home-writing-title">Writing.</h2><p>Poems and notes on making things.</p></div>
                <div className="home-writing-links"><Link href="/writes/grace"><span>Poem</span><strong>Grace</strong><span aria-hidden="true">↗</span></Link><Link href="/writes/where-the-first-idea-led"><span>Story</span><strong>Where the first idea led</strong><span aria-hidden="true">↗</span></Link></div>
            </section>
        </>
    );
}
