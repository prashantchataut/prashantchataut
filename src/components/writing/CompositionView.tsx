'use client';

import { useEffect, useRef } from 'react';
import type { Composition } from '@/data/content';
import { formatDate } from '@/lib/format';

export default function CompositionView({ piece }: { piece: Composition }) {
    const bodyRef = useRef<HTMLElement>(null);
    const fillRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const body = bodyRef.current;
        const fill = fillRef.current;
        if (!body || !fill) return;

        const update = () => {
            const rect = body.getBoundingClientRect();
            const viewport = window.innerHeight;
            const top = viewport * 0.78;
            const bottom = viewport * 0.32;
            const span = rect.height + top - bottom;
            const read = Math.min(1, Math.max(0, (top - rect.top) / span));
            fill.style.transform = `scaleY(${read})`;
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, []);

    const isPoem = Boolean(piece.stanzas?.length);

    return (
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
            <div className="hidden md:col-span-1 md:flex md:justify-start" aria-hidden="true">
                <div className="relative h-[20rem] w-px bg-edge md:sticky md:top-32">
                    <div
                        ref={fillRef}
                        className="absolute inset-0 origin-top bg-glacier transition-transform duration-150 ease-linear"
                        style={{ transform: 'scaleY(0)' }}
                    />
                </div>
            </div>

            <article ref={bodyRef} className="md:col-span-8 md:col-start-4">
                <header className="mb-14">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                        <span className="font-mono text-[0.6rem] uppercase tracking-micro text-faint">
                            {piece.kind}
                        </span>
                        <time
                            dateTime={piece.date}
                            className="font-mono text-[0.6rem] uppercase tracking-micro text-faint"
                        >
                            {formatDate(piece.date)}
                        </time>
                    </div>

                    <h1 className="mt-7 max-w-[18ch] font-literary text-[clamp(2.4rem,7vw,4.6rem)] font-light leading-[0.98] tracking-[-0.03em] text-ink">
                        {piece.title}
                    </h1>

                    {piece.note && (
                        <p className="mt-6 max-w-[44ch] font-literary text-[1.08rem] italic leading-relaxed text-mist">
                            {piece.note}
                        </p>
                    )}

                    <div className="mt-9 h-px w-full bg-edge" />
                </header>

                {isPoem ? (
                    <div className="flex flex-col gap-14">
                        {piece.stanzas?.map((stanza, i) => (
                            <div key={i} className="flex flex-col">
                                {stanza.map((line, j) => (
                                    <p
                                        key={`${i}-${j}`}
                                        className="font-literary text-[clamp(1.12rem,2.2vw,1.45rem)] font-light leading-[1.85] tracking-[-0.005em] text-ink"
                                    >
                                        {line}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {piece.paragraphs?.map((p, i) => (
                            <p
                                key={i}
                                className="max-w-[62ch] font-literary text-[clamp(1.1rem,1.9vw,1.3rem)] font-light leading-[1.7] text-ink"
                            >
                                {p}
                            </p>
                        ))}
                    </div>
                )}

                <footer className="mt-20 border-t border-edge pt-7">
                    <p className="font-mono text-[0.62rem] uppercase tracking-micro text-faint">
                        prashant chataut · {formatDate(piece.date)}
                    </p>
                </footer>
            </article>
        </div>
    );
}