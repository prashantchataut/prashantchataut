import Link from 'next/link';
import { site } from '@/data/config';
import { CopyEmail, FooterGarden, NepalClock } from './FooterBits';

const EMAIL = 'prashantchataut8@gmail.com';

export default function Footer() {
    return (
        <footer id="contact" className="site-footer ft">
            <div className="ft-inner">
                <div className="ft-main">
                    <div className="ft-talk">
                        <h2>Let’s talk.</h2>
                        <p className="ft-lede">Say hello, ask about a project, or tell me what you are building.</p>
                        <div className="ft-mail">
                            <a className="ft-email" href={site.links.email}>{EMAIL}</a>
                            <CopyEmail email={EMAIL} />
                        </div>
                    </div>
                    <nav className="ft-links" aria-label="Elsewhere">
                        <a href={site.links.github}>GitHub</a>
                        <a href={site.links.instagram}>Instagram</a>
                        <Link href="/writes">Writing</Link>
                        <Link href="/now">What I’m working on</Link>
                    </nav>
                </div>
                <div className="ft-bottom">
                    <p>© {new Date().getFullYear()} Prashant Chataut</p>
                    <NepalClock />
                    <FooterGarden />
                    <a href="#main-content">Back to top</a>
                </div>
            </div>
        </footer>
    );
}
