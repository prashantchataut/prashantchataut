'use client';
export default function NowError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return <section className="subpage"><h1>Couldn’t load this page.</h1><p className="intro">Try again, or return to the homepage.</p><button className="button button-dark" onClick={reset}>Try again</button> <a className="text-link" href="/">Return home</a></section>;
}
