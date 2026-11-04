import Link from 'next/link';
import PixelIcon from '@/components/pixel/PixelIcon';
import { site } from '@/data/config';
import { CopyEmail, FooterGarden, NepalClock } from './FooterBits';

const EMAIL = 'prashantchataut8@gmail.com';

export default function Footer() {
    return (
        <footer id="contact" className="site-footer ft">
            <div className="footer-inner ft-inner">
                <div className="ft-main">
                    <div className="ft-talk">
                        <h2>Let’s talk.</h2>
                        <p className="ft-lede">Say hello, ask about a project, or tell me what you are building.</p>
                        <div className="ft-mail">
                            <a className="ft-email" href={site.links.email}>
                                {EMAIL} <PixelIcon name="out" />
                            </a>
                            <CopyEmail email={EMAIL} />
                        </div>
                        <NepalClock />
                    </div>
                    <nav className="ft-links" aria-label="Elsewhere">
                        <a href={site.links.github}>GitHub <PixelIcon name="out" /></a>
                        <a href={site.links.instagram}>Instagram <PixelIcon name="out" /></a>
                        <Link href="/writes">Writing <PixelIcon name="right" /></Link>
                        <Link href="/now">What I’m working on <PixelIcon name="right" /></Link>
                    </nav>
                </div>
                <FooterGarden />
                <div className="ft-bottom">
                    <p>© {new Date().getFullYear()} Prashant Chataut</p>
                    <a href="#main-content">Back to top <PixelIcon name="up" /></a>
                </div>
            </div>
        </footer>
    );
}
