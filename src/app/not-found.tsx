import Link from 'next/link';
export default function NotFound() {
    return <section className="subpage"><h1>Page not found.</h1><p className="intro">This page may have moved, or the link might be incorrect.</p><Link className="button button-dark" href="/">Return home</Link></section>;
}
