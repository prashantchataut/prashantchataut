const QUOTES = [
    {
        text: 'We are all in the gutter, but some of us are looking at the stars.',
        by: 'Oscar Wilde',
        top: '16%',
        size: 'clamp(0.9rem, 1.7vw, 1.45rem)',
        duration: '224s',
        delay: '-40s',
        reverse: false,
    },
    {
        text: 'Not all those who wander are lost.',
        by: 'J. R. R. Tolkien',
        top: '41%',
        size: 'clamp(0.82rem, 1.5vw, 1.2rem)',
        duration: '186s',
        delay: '-104s',
        reverse: true,
    },
    {
        text: 'There is no greater agony than bearing an untold story inside you.',
        by: 'Maya Angelou',
        top: '67%',
        size: 'clamp(0.86rem, 1.6vw, 1.3rem)',
        duration: '246s',
        delay: '-150s',
        reverse: false,
    },
    {
        text: 'Whatever our souls are made of, his and mine are the same.',
        by: 'Emily Brontë',
        top: '85%',
        size: 'clamp(0.8rem, 1.4vw, 1.1rem)',
        duration: '204s',
        delay: '-72s',
        reverse: true,
    },
];

export default function AmbientQuotes() {
    return (
        <div className="ambient" aria-hidden="true" style={{ opacity: 0.075 }}>
            {QUOTES.map((q) => (
                <span
                    key={q.text}
                    className={q.reverse ? 'drift drift-b' : 'drift'}
                    style={{
                        top: q.top,
                        fontSize: q.size,
                        animationDuration: q.duration,
                        animationDelay: q.delay,
                    }}
                >
                    {q.text}
                    <span
                        className="font-mono not-italic"
                        style={{ fontSize: '0.6em', letterSpacing: '0.18em', marginLeft: '1.2em' }}
                    >
                        {q.by}
                    </span>
                </span>
            ))}
        </div>
    );
}