'use client';

import { useEffect, useState } from 'react';
import { computeAge, yearProgress } from '@/lib/age';

const METER = 54;

function Unit({ value, label }: { value: string | number; label: string }) {
    return (
        <div className="flex flex-col gap-3">
            <span className="font-mono text-[clamp(1.9rem,5.4vw,3.3rem)] font-light leading-none tracking-tight text-ink tabular-nums">
                {value}
            </span>
            <span className="text-[0.55rem] uppercase tracking-micro text-faint">{label}</span>
        </div>
    );
}

export default function AgeInMotion() {
    const [state, setState] = useState<{
        age: ReturnType<typeof computeAge> | null;
        year: number;
        pct: number;
        daysLeft: number;
    }>({ age: null, year: 0, pct: 0, daysLeft: 0 });

    useEffect(() => {
        const tick = () => {
            const now = Date.now();
            setState({ age: computeAge(now), ...yearProgress(now) });
        };
        tick();
        const id = window.setInterval(tick, 1000);
        return () => window.clearInterval(id);
    }, []);

    const { age } = state;
    const pad = (v: number) => String(v).padStart(2, '0');
    const filled = Math.round(state.pct * METER);
    const meter = `${'#'.repeat(filled)}${'.'.repeat(METER - filled)}`;

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-end gap-x-10 gap-y-8 sm:gap-x-16">
                <Unit value={age ? age.years : '—'} label="years" />
                <Unit value={age ? pad(age.months) : '—'} label="months" />
                <Unit value={age ? pad(age.days) : '—'} label="days" />
                <div className="flex flex-col gap-3">
                    <span className="font-mono text-[clamp(1.9rem,5.4vw,3.3rem)] font-light leading-none tracking-tight text-glacier tabular-nums">
                        {age ? `${age.hh}:${age.mm}:${age.ss}` : '--:--:--'}
                    </span>
                    <span className="text-[0.55rem] uppercase tracking-micro text-faint">
                        hours · minutes · seconds
                    </span>
                </div>
            </div>

            <div className="mt-14">
                <div className="flex items-baseline justify-between gap-6 text-[0.55rem] uppercase tracking-micro text-faint">
                    <span>{state.year || '—'}</span>
                    <span>{state.daysLeft} days left in the year</span>
                </div>

                <pre
                    aria-label={`${Math.round(state.pct * 100)} percent through ${state.year}`}
                    className="mt-3 overflow-hidden whitespace-pre font-mono text-[0.7rem] leading-none text-glacier"
                >
                    {meter}
                </pre>
            </div>

            <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                <p className="font-mono text-[0.62rem] uppercase tracking-micro text-faint">
                    born 27 may 2009, 22:30 · kathmandu · utc+05:45
                </p>
                <p className="font-mono text-[0.62rem] uppercase tracking-micro text-faint">
                    {age ? age.totalDays.toLocaleString('en-US') : '—'} days so far
                </p>
            </div>
        </div>
    );
}