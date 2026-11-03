import Link from 'next/link';
import ThemeToggle from '@/components/providers/ThemeProvider';
export default function Header() { return <header className="site-header"><div className="header-inner"><Link className="wordmark" href="/" aria-label="Prashant Chataut, home">Prashant Chataut</Link><nav aria-label="Main navigation" className="main-nav"><Link href="/#work">Work</Link><Link href="/#about">About</Link><Link href="/writes">Writing</Link></nav><ThemeToggle /></div></header>; }
