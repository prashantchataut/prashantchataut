import Image from 'next/image';

export default function About() {
    return (
        <section id="about" className="about section-wrap" aria-labelledby="about-title">
            <div className="about-photo"><Image src="/images/prashant-photo.jpg" alt="Prashant Chataut" width={894} height={901} sizes="(max-width: 700px) 85vw, 430px" /><span>Hi from Nepal!</span></div>
            <div className="about-copy">
                <h2 id="about-title">Hello, I’m Prashant.</h2>
                <p>I design and build mobile and web apps from Nepal. I like starting with a real problem, making something people can use, and learning from what happens next.</p>
                <p>That has led me from study resources to game emulation and a quieter way to journal. Different projects, same curiosity.</p>
                <a className="text-link" href="/now">What I’m working on <span aria-hidden="true">↗</span></a>
            </div>
        </section>
    );
}
