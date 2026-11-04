'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Hand-drawn marginalia for the reading pages. Each passage gets one small line drawing that belongs to what it says.
 * They are single-stroke drawings that draw themselves when they scroll into view and then rest, floating very slightly.
 * k: 'a' accent stroke, 'f' soft accent fill, 'af' both, 'p' paper fill (hides what is behind), 'dot' a drawn point.
 * shut: a shutter that swings closed from the given side.
 */
type Stroke = { d: string; k?: 'a' | 'f' | 'af' | 'p' | 'dot'; shut?: 'l' | 'r'; w?: number };
type Art = { name: string; label: string; strokes: Stroke[] };

const GRACE: Art[] = [
    {
        name: 'storm',
        label: 'A storm cloud with rain over a wind-bent tree',
        strokes: [
            { d: 'M26 66C10 66 8 44 28 42C30 24 58 18 66 34C76 22 104 26 104 44C124 42 130 66 110 68Z', k: 'f' },
            { d: 'M70 72L60 94L74 92L62 118', k: 'a' },
            { d: 'M34 80l-6 14M46 84l-6 14M92 80l-6 14M108 84l-6 14M122 76l-6 14' },
            { d: 'M132 152C130 136 126 122 110 108C100 104 94 108 90 116' },
            { d: 'M126 132C134 126 142 124 150 128M118 118C122 110 130 106 138 106' },
            { d: 'M18 152C56 147 100 156 150 151' },
        ],
    },
    {
        name: 'feather',
        label: 'A feather that has come to rest',
        strokes: [
            { d: 'M34 112C58 70 100 48 138 42C134 78 106 112 66 126C52 128 40 124 34 112Z', k: 'f' },
            { d: 'M34 114C66 94 100 70 138 42' },
            { d: 'M72 100l-8 -18M88 88l-6 -20M104 76l-4 -18M60 114l16 4M78 104l20 4M96 92l20 2' },
            { d: 'M16 146C46 141 112 141 146 146M40 154C70 150 100 150 130 154', k: 'a' },
        ],
    },
    {
        name: 'swallow',
        label: 'A swallow in flight',
        strokes: [
            { d: 'M46 100C66 95 88 92 106 84C112 80 118 82 122 86' },
            { d: 'M82 91C72 70 54 56 30 52C46 66 58 80 66 96Z', k: 'af' },
            { d: 'M98 86C104 66 124 52 150 50C134 62 122 76 116 88Z', k: 'af' },
            { d: 'M46 100L24 112M46 100L28 122' },
            { d: 'M8 74C18 66 30 66 40 70M12 92C22 86 30 86 38 88', k: 'a' },
        ],
    },
    {
        name: 'watcher',
        label: 'Someone watching from behind a window',
        strokes: [
            { d: 'M36 152V72C36 38 124 38 124 72V152Z' },
            { d: 'M46 152V74C46 50 114 50 114 74V152' },
            { d: 'M36 66C50 86 44 112 52 152', k: 'a' },
            { d: 'M72 152C72 134 78 124 92 122C106 124 110 136 110 152', k: 'f' },
            { d: 'M92 100C82 100 80 114 90 118C102 114 102 102 92 100Z', k: 'f' },
            { d: 'M26 152H134' },
        ],
    },
    {
        name: 'shutters',
        label: 'Shutters closing over a window',
        strokes: [
            { d: 'M36 152V72C36 38 124 38 124 72V152Z' },
            { d: 'M36 152V72C36 50 58 42 80 40V152Z', k: 'p', shut: 'l' },
            { d: 'M52 56V152M66 46V152', shut: 'l' },
            { d: 'M124 152V72C124 50 102 42 80 40V152Z', k: 'p', shut: 'r' },
            { d: 'M108 56V152M94 46V152', shut: 'r' },
            { d: 'M26 152H134', k: 'a' },
        ],
    },
];

const JOURNEY: Art[] = [
    {
        name: 'seedling',
        label: 'A seedling pushing out of the soil',
        strokes: [
            { d: 'M80 150V106' },
            { d: 'M80 108C58 108 46 92 48 76C68 76 80 90 80 108Z', k: 'af' },
            { d: 'M80 120C100 118 112 102 110 86C92 86 80 100 80 120Z', k: 'af' },
            { d: 'M22 152C44 148 66 154 80 151C100 148 120 155 142 151' },
            { d: 'M80 54V66M62 60l6 8M98 60l-6 8M48 74l8 4M112 70l-8 4', k: 'a' },
        ],
    },
    {
        name: 'bottle',
        label: 'A medicine bottle with a leaf for a label',
        strokes: [
            { d: 'M66 58V44H94V58' },
            { d: 'M62 58H98C102 68 104 76 104 86V140C104 147 98 152 92 152H68C62 152 56 147 56 140V86C56 76 58 68 62 58Z' },
            { d: 'M66 98C74 84 92 86 96 102C88 116 72 116 66 98Z', k: 'af' },
            { d: 'M68 106C78 102 88 98 94 94' },
            { d: 'M58 130C68 124 76 136 86 130C94 126 100 128 104 130', k: 'a' },
        ],
    },
    {
        name: 'tomato',
        label: 'A tomato, for the focus timer, with a check mark on it',
        strokes: [
            { d: 'M80 64C50 56 26 84 34 114C42 142 68 152 80 150C92 152 118 142 126 114C134 84 110 56 80 64Z', k: 'f' },
            { d: 'M80 64C74 52 64 52 56 58C64 62 72 64 80 64ZM80 64C86 52 96 50 104 56C96 62 88 64 80 64Z', k: 'a' },
            { d: 'M80 64V46' },
            { d: 'M58 108L74 122L104 90', k: 'a' },
        ],
    },
    {
        name: 'letter',
        label: 'A letter to a future self, with a quill',
        strokes: [
            { d: 'M30 50C58 44 98 44 122 50C118 82 124 104 122 130C98 124 58 126 30 132C34 104 26 80 30 50Z', k: 'f' },
            { d: 'M46 70C60 66 70 74 84 70C94 68 102 70 108 70M46 86C58 82 72 90 86 86M46 102C56 98 66 104 76 100' },
            { d: 'M108 154C112 124 130 100 154 84C156 112 138 140 108 154Z', k: 'af' },
            { d: 'M108 154C116 130 132 106 154 84M96 160C100 158 104 156 108 154', k: 'a' },
        ],
    },
    {
        name: 'book',
        label: 'An open book with a shoot growing from its spine',
        strokes: [
            { d: 'M80 70C60 58 40 58 22 64V130C40 124 60 124 80 136C100 124 120 124 138 130V64C120 58 100 58 80 70Z', k: 'f' },
            { d: 'M80 70V136' },
            { d: 'M34 82C46 80 58 82 68 86M34 96C46 94 58 96 68 100M92 86C104 82 116 80 128 82M92 100C104 96 116 94 128 96' },
            { d: 'M80 70C80 52 86 38 98 30', k: 'a' },
            { d: 'M82 54C72 48 64 48 58 52C66 58 74 58 82 54Z', k: 'af' },
        ],
    },
    {
        name: 'mochi',
        label: 'A soft mochi rabbit mid hop',
        strokes: [
            { d: 'M36 130C28 102 50 84 80 84C110 84 132 102 124 130C120 144 40 144 36 130Z', k: 'f' },
            { d: 'M62 88C54 58 60 38 70 40C80 44 76 72 74 86M90 86C94 62 104 42 112 46C120 52 108 76 100 90' },
            { d: 'M66 110h.1M94 110h.1', k: 'dot', w: 5 },
            { d: 'M74 118C78 122 84 122 88 118' },
            { d: 'M18 152C34 128 52 128 62 152M130 66C140 56 148 56 152 62M134 80C142 74 148 76 150 80', k: 'a' },
        ],
    },
    {
        name: 'path',
        label: 'A winding path over hills, with a marker for each project',
        strokes: [
            { d: 'M24 152C74 152 38 124 80 118C122 112 88 90 112 76C124 68 132 58 134 42', k: 'a' },
            { d: 'M44 152C86 150 56 132 90 126C130 120 98 98 122 84C134 76 142 64 144 46' },
            { d: 'M52 143h.1M80 119h.1M108 100h.1M121 80h.1M134 54h.1', k: 'dot', w: 6 },
            { d: 'M16 112C34 92 54 88 70 96M110 58C126 44 144 42 152 48', k: 'f' },
        ],
    },
];

const SETS: Record<string, Art[]> = { grace: GRACE, journey: JOURNEY };

export default function MarginArt({ theme, index }: { theme: string; index: number }) {
    const art = (SETS[theme] ?? [])[index];
    const ref = useRef<HTMLDivElement>(null);
    const [seen, setSeen] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.5 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    if (!art) return null;
    return (
        <div ref={ref} className={`m-art${seen ? ' is-in' : ''}`} data-art={art.name} data-side={index % 2 ? 'l' : 'r'} role="img" aria-label={art.label}>
            <svg viewBox="0 0 160 170" focusable="false" aria-hidden="true">
                {art.strokes.map((s, i) => (
                    <path
                        key={i}
                        d={s.d}
                        pathLength={1}
                        className={`m-s${s.k ? ` m-${s.k}` : ''}${s.shut ? ` m-shut-${s.shut}` : ''}`}
                        style={{ ['--i' as string]: i, ...(s.w ? { strokeWidth: s.w } : {}) }}
                    />
                ))}
            </svg>
        </div>
    );
}
