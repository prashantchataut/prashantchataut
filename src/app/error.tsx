'use client';
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return <section className="subpage"><h1>Something went wrong.</h1><p className="intro">The page couldn’t load. Try again, or return to the homepage.</p><button className="button button-dark" onClick={reset}>Try again</button> <a className="text-link" href="/">Return home</a></section>;
}
