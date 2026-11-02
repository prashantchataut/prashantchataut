import Link from 'next/link';

export default function Header() {
    return (
        <header className="site-header">
            <div className="header-inner">
                <Link className="wordmark" href="/" aria-label="Prashant Chataut, home"><span className="mark" aria-hidden="true">✳︎</span> Prashant Chataut</Link>
                <nav aria-label="Main navigation" className="main-nav">
                    <Link href="/#work">Work</Link>
                    <Link href="/#about">About</Link>
                    <Link href="/writes">Notes</Link>
                </nav>
                <a className="header-contact" href="mailto:prashantchataut8@gmail.com">Say hello <span aria-hidden="true">↗</span></a>
            </div>
        </header>
    );
}
