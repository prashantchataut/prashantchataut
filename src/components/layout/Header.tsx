import Link from 'next/link';

export default function Header() {
    return (
        <header className="site-header">
            <div className="header-inner">
                <Link className="wordmark" href="/" aria-label="Prashant Chataut, home"><svg className="mark" viewBox="0 0 36 30" aria-hidden="true"><path d="M17 14C11 1 1 2 3 10c1 4 6 5 11 6-5 1-8 4-6 7 2 3 7 0 10-6M19 14C25 1 35 2 33 10c-1 4-6 5-11 6 5 1 8 4 6 7-2 3-7 0-10-6" fill="#f8f8f3" stroke="currentColor" strokeWidth="1.3"/><path d="M18 12v8m0-8-3-4m3 4 3-4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> Prashant Chataut</Link>
                <nav aria-label="Main navigation" className="main-nav">
                    <Link href="/#work">Work</Link>
                    <Link href="/#about">About</Link>
                    <Link href="/writes">Writing</Link>
                </nav>
                <a className="header-contact" href="mailto:prashantchataut8@gmail.com">Say hello <span aria-hidden="true">↗</span></a>
            </div>
        </header>
    );
}
