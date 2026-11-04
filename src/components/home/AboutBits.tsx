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

/** Plays the recorded pronunciation. */
export function NameAudio({ phonetic, devanagari }: { phonetic: string; devanagari: string }) {
    const audio = useRef<HTMLAudioElement | null>(null);
    const [playing, setPlaying] = useState(false);
    useEffect(() => () => { audio.current?.pause(); }, []);
    const toggle = () => {
        if (!audio.current) {
            const a = new Audio('/audio/prashant-pronunciation.wav');
            a.addEventListener('ended', () => setPlaying(false));
            a.addEventListener('pause', () => setPlaying(false));
            a.addEventListener('play', () => setPlaying(true));
            audio.current = a;
        }
        const a = audio.current;
        if (a.paused) { a.currentTime = 0; void a.play(); } else a.pause();
    };
    return (
        <button type="button" className="name-audio" onClick={toggle} aria-pressed={playing}>
            <span className="name-audio-icon" aria-hidden="true" data-playing={playing}>
                <svg viewBox="0 0 24 24" width="18" height="18"><path d={playing ? 'M7 5h3.5v14H7zM13.5 5H17v14h-3.5z' : 'M8 5.5v13l11-6.5z'} /></svg>
            </span>
            <span>
                <span lang="ne" className="name-audio-ne">{devanagari}</span>
                <span className="name-audio-ph">{phonetic}</span>
            </span>
            <span className="sr-only">{playing ? 'Pause pronunciation' : 'Hear how to say Prashant'}</span>
        </button>
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
