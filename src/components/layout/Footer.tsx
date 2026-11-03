import { site } from '@/data/config';

export default function Footer() {
    return (
        <footer id="contact" className="site-footer">
            <div className="footer-inner">
                <h2>Have something<br />{" "}in mind?</h2>
                <p className="footer-description">Questions, ideas, or just a hello. My inbox is open.</p>
                <a className="footer-email" href={site.links.email}>prashantchataut8@gmail.com <span aria-hidden="true">↗</span></a>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Prashant Chataut<br /><span></span></p>
                    <div className="footer-links"><a href={site.links.github}>GitHub ↗</a><a href={site.links.instagram}>Instagram ↗</a><a href="/now">Now</a><a href="#main-content">Back to top ↑</a></div>
                </div>
            </div>
        </footer>
    );
}
