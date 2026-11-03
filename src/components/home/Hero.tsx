export default function Hero() {
    return (
        <section className="hero" aria-labelledby="hero-title">
            <div className="hero-inner">
                <h1 id="hero-title">A little more room to<br />{" "}learn, play, and think.</h1>
                <p className="hero-copy">I’m Prashant, a developer in Nepal building apps for everyday life.</p>
                <div className="hero-actions">
                    <a className="button button-dark" href="#work">Explore the projects <span aria-hidden="true">↓</span></a>
                    <a className="text-link" href="https://github.com/prashantchataut">Visit GitHub <span aria-hidden="true">↗</span></a>
                </div>
                <div className="hero-art" role="img" aria-label="Pixel-art Himalayan landscape, with a small house under a cloud-filled sky" />
                <div className="hero-caption"><span>A little corner of the internet</span><span>Made in Nepal</span></div>
            </div>
        </section>
    );
}
