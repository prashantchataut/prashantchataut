import Image from 'next/image';

export default function Projects() {
    return (
        <section id="work" className="work section-wrap" aria-labelledby="work-title">
            <div className="section-heading">
                <h2 id="work-title">Things made to be used.</h2>
                <p>Three projects, each starting with a different everyday need.</p>
            </div>
            <article className="project project-nebians">
                <div className="project-copy">
                    <p className="project-type">Education & community</p>
                    <h3>NEBians</h3>
                    <p className="project-lead">School resources, together.</p>
                    <p>Notes, past papers, exam updates, and a forum bring students and teachers into the same space. Available on the web and Android.</p>
                    <div className="project-links"><a className="button button-dark" href="https://nebians.consica.com.np/">Visit NEBians <span aria-hidden="true">↗</span></a><a className="text-link" href="https://play.google.com/store/apps/details?id=com.neb.ians">Google Play <span aria-hidden="true">↗</span></a><a className="text-link" href="https://www.instagram.com/the_nebians">Instagram <span aria-hidden="true">↗</span></a></div>
                </div>
                <div className="project-visual nebians-visual">
                    <div className="visual-caption">Notes, questions, community</div>
                    <Image src="/images/nebians/home.png" alt="NEBians home screen with study resources" width={460} height={1024} sizes="(max-width: 700px) 30vw, 16vw" className="phone phone-one" />
                    <Image src="/images/nebians/shot-1.jpg" alt="NEBians home screen with its profile menu open" width={720} height={1611} sizes="(max-width: 700px) 30vw, 16vw" className="phone phone-two" />
                </div>
            </article>
            <article className="project project-retra">
                <div className="project-visual retra-visual">
                    <div className="visual-caption">A pocketful of play</div>
                    <Image src="/images/retra-screen.svg" alt="Retra home screen featuring the original game Mochi Hop" width={390} height={846} className="phone retra-phone" unoptimized />
                </div>
                <div className="project-copy">
                    <p className="project-type">Games & nostalgia</p>
                    <h3>Retra</h3>
                    <p className="project-lead">A home for GBA games.</p>
                    <p>An Android Game Boy Advance emulator with its own engine, a patcher, and an original game called Mochi Hop. Built for homebrew and games you own.</p>
                    <div className="project-links"><a className="button button-dark" href="https://github.com/prashantchataut/Retra">Explore Retra <span aria-hidden="true">↗</span></a></div>
                </div>
            </article>
            <article className="project project-prody">
                <div className="project-copy">
                    <p className="project-type">Journaling & reflection</p>
                    <h3>Prody</h3>
                    <p className="project-lead">A little space to pause.</p>
                    <p>Write a few lines, reflect on your thoughts, or leave a message for your future self. No streaks to keep up with.</p>
                    <div className="project-links"><a className="button button-dark" href="https://github.com/prashantchataut/Prody/releases/latest">Explore Prody <span aria-hidden="true">↗</span></a></div>
                </div>
                <div className="project-visual prody-visual">
                    <div className="visual-caption">A quieter kind of progress</div>
                    <Image src="/images/prody1.png" alt="Prody journal and future-self message concept" width={1440} height={2560} sizes="(max-width: 700px) 30vw, 16vw" className="phone prody-phone" />
                    <Image src="/images/prody2.png" alt="Prody reflection and patterns concept" width={1440} height={2560} sizes="(max-width: 700px) 30vw, 16vw" className="phone prody-phone second" />
                </div>
            </article>
        </section>
    );
}
