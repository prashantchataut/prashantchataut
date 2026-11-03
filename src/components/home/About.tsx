import Image from 'next/image';

export default function About() {
    return <section id="about" className="about section-wrap" aria-labelledby="about-title">
        <div className="about-photo avatar-portrait"><Image src="/images/prashant-avatar.svg" alt="An illustration of Prashant as a child, wearing a red checked shirt" width={560} height={560} sizes="(max-width: 700px) 85vw, 430px" unoptimized /></div>
        <div className="about-copy"><h2 id="about-title">A little about me.</h2><p>I’m Prashant, a developer from Nepal. I make apps for real needs, and I’m interested in the ideas and experiences that shape the way we live.</p><p>I started building in grade 10. Since then, one project has often led to another—and the questions have kept changing.</p><a className="text-link" href="/writes/where-the-first-idea-led">The story so far <span aria-hidden="true">↗</span></a></div>
    </section>;
}
