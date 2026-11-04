'use client';
import { useEffect, useRef, useState } from 'react';
import FlowerArt from '@/components/floral/FlowerArt';

/** Then and now in one frame. A native range input sits over the portraits, so dragging, tapping and arrow keys all work. */
export function PortraitReveal() {
    const [pos, setPos] = useState(50);
    return (
        <figure className="reveal" style={{ ['--pos' as string]: `${pos}%` }}>
            <div className="reveal-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="reveal-then" src="/images/portrait-child.svg" alt="Illustrated portrait of Prashant as a child" width={800} height={800} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="reveal-now" src="/images/portrait-present.svg" alt="Illustrated portrait of Prashant today" width={800} height={800} />
                <span className="reveal-line" aria-hidden="true"><i /></span>
                <input
                    className="reveal-input"
                    type="range"
                    min={0}
                    max={100}
                    value={pos}
                    onChange={(e) => setPos(Number(e.target.value))}
                    aria-label="Slide to compare Prashant as a child on the left with today on the right"
                />
                <span className="reveal-tag reveal-tag-then" aria-hidden="true">Then</span>
                <span className="reveal-tag reveal-tag-now" aria-hidden="true">Now</span>
            </div>
            <figcaption>Drag to compare.</figcaption>
        </figure>
    );
}

export type Step = { title: string; text: string; kind: number };

/** The projects as a vine: it grows across the page and each step flowers when the vine reaches it. */
export function GrowthPath({ steps }: { steps: Step[] }) {
    const root = useRef<HTMLOListElement>(null);
    const [seen, setSeen] = useState(false);
    useEffect(() => {
        const el = root.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSeen(true); }, { threshold: 0.25 });
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return (
        <ol ref={root} className="path" data-seen={seen}>
            {steps.map((s, i) => (
                <li key={s.title} style={{ ['--i' as string]: i }}>
                    <svg viewBox="-13 -13 26 26" width="26" height="26" aria-hidden="true" focusable="false">
                        <g className="path-flower"><FlowerArt kind={s.kind} r={10} /></g>
                    </svg>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                </li>
            ))}
        </ol>
    );
}
