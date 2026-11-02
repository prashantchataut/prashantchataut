'use client';

import { useEffect, useState } from 'react';
import { computeAge } from '@/lib/age';

const pad = (v: number) => String(v).padStart(2, '0');

/** A live strip in the header, so the clock never leaves the screen. */
export default function AgeTicker() {
    const [line, setLine] = useState('');

    useEffect(() => {
        const tick = () => {
            const a = computeAge(Date.now());
            setLine(`${pad(a.years)}.${pad(a.months)}.${pad(a.days)}  ${a.hh}:${a.mm}:${a.ss}`);
        };
        tick();
        const id = window.setInterval(tick, 1000);
        return () => window.clearInterval(id);
    }, []);

    return (
        <span
            className="font-mono text-[0.62rem] tabular-nums tracking-micro text-faint"
            title="Time alive, in Kathmandu"
        >
            {line || '—'}
        </span>
    );
}