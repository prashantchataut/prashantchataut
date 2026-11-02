'use client';

import { useEffect, useState } from 'react';
import { contours, rows, sky, thaw, tileX, tileY } from '@/lib/ascii';

type Plate = { key: string; art: string; motion: string; place: string };

export default function AsciiArt() {
    const [plates, setPlates] = useState<Plate[]>([]);

    useEffect(() => {
        const build = () => {
            const fontPx = window.innerWidth < 700 ? 7 : 8;
            // JetBrains Mono advances at 0.6em
            const cols = Math.ceil(window.innerWidth / (fontPx * 0.6)) + 2;
            const screenRows = Math.ceil(window.innerHeight / (fontPx * 1.16)) + 2;

            // capped so the mass reads as a plate, not a full-bleed texture
            const plateW = Math.min(148, cols);
            const plateH = Math.round(plateW * 0.39);

            setPlates([
                {
                    key: 'mass',
                    art: rows(contours(plateW, plateH, 20090527)).join('\n'),
                    motion: 'plate-turn',
                    place: 'plate-mass',
                },
                {
                    // tiled twice across so the horizontal loop is seamless
                    key: 'sky',
                    art: rows(tileX(sky(cols, Math.min(30, screenRows), 20090713))).join('\n'),
                    motion: 'plate-drift-x',
                    place: 'plate-top',
                },
                {
                    // tiled twice down, then animated -50% -> 0
                    key: 'thaw',
                    art: rows(tileY(thaw(cols, screenRows, 20130713))).join('\n'),
                    motion: 'plate-fall',
                    place: 'plate-top',
                },
            ]);
        };

        build();
        window.addEventListener('resize', build);
        return () => window.removeEventListener('resize', build);
    }, []);

    const fontPx = typeof window !== 'undefined' && window.innerWidth < 700 ? 7 : 8;

    return (
        <div className="ambient opacity-ambient" aria-hidden="true">
            {plates.map((p) => (
                <pre
                    key={p.key}
                    className={`plate ${p.motion} ${p.place}`}
                    style={{ fontSize: `${fontPx}px` }}
                >
                    {p.art}
                </pre>
            ))}
        </div>
    );
}