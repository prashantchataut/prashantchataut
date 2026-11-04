'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import FlowerArt, { FLOWER_COLORS } from '@/components/floral/FlowerArt';
import { Garden, type Item } from '@/components/floral/flora';

/** Local time in Kathmandu, computed in the browser. Empty until mounted so server and client markup match. */
export function NepalClock() {
    const [text, setText] = useState('');
    useEffect(() => {
        const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kathmandu' });
        const tick = () => setText(fmt.format(new Date()));
        tick();
        const id = window.setInterval(tick, 20000);
        return () => window.clearInterval(id);
    }, []);
    return (
        <p className="ft-clock" aria-live="off">
            {text ? <>It is <time>{text}</time> in Nepal right now.</> : <>Based in Nepal.</>}
        </p>
    );
}

/** The email address with a one-tap copy. */
export function CopyEmail({ email }: { email: string }) {
    const [state, setState] = useState<'idle' | 'done' | 'fail'>('idle');
    const timer = useRef<number | undefined>(undefined);
    useEffect(() => () => window.clearTimeout(timer.current), []);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setState('done');
        } catch {
            setState('fail');
        }
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setState('idle'), 2200);
    };
    return (
        <button type="button" className="ft-copy" onClick={copy}>
            {state === 'done' ? 'Copied' : state === 'fail' ? 'Copy failed, select it instead' : 'Copy address'}
            <span className="sr-only" role="status">{state === 'done' ? 'Email address copied' : ''}</span>
        </button>
    );
}

type Bud = { x: number; y: number; r: number; kind: number; delay: number; dir: number };

const SPRIG_W = 150;
const SPRIG_H = 92;
/** Three small flowers on hairline stems, tucked into the corner. They open as the footer arrives and answer to touch. */
const BUDS: Bud[] = [
    { x: 26, y: 40, r: 7, kind: 4, delay: 300, dir: -1 },
    { x: 78, y: 18, r: 9, kind: 2, delay: 520, dir: 1 },
    { x: 124, y: 46, r: 6.5, kind: 1, delay: 740, dir: -1 },
];

export function FooterGarden() {
    const svg = useRef<SVGSVGElement>(null);
    const layer = useRef<SVGGElement>(null);
    const els = useRef<(SVGGElement | null)[]>([]);
    const [grown, setGrown] = useState(false);

    useEffect(() => {
        const node = svg.current;
        if (!node) return;
        const io = new IntersectionObserver(([e]) => setGrown(e.isIntersecting));
        io.observe(node);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        const node = svg.current, petals = layer.current;
        if (!node || !petals) return;
        const items: Item[] = BUDS.map((b, i) => ({ el: els.current[i] as SVGGElement, x: b.x, y: b.y, r: b.r, delay: b.delay, dir: b.dir, color: FLOWER_COLORS[b.kind] }));
        return new Garden(node, items, { layer: petals, turn: 0.05 }).mount();
    }, []);

    return (
        <div className="ft-garden" aria-hidden="true">
            <svg ref={svg} className={grown ? 'is-grown' : undefined} width={SPRIG_W} height={SPRIG_H} viewBox={`0 0 ${SPRIG_W} ${SPRIG_H}`} focusable="false">
                {BUDS.map((b, i) => (
                    <path
                        key={`s${i}`}
                        className="ft-stem"
                        d={`M${b.x + (i === 1 ? 0 : i === 0 ? 8 : -8)} ${SPRIG_H + 2}C${b.x + (i % 2 ? 10 : -10)} ${SPRIG_H - (SPRIG_H - b.y) * 0.5} ${b.x - (i % 2 ? 6 : -6)} ${b.y + 22} ${b.x} ${b.y}`}
                        pathLength={1}
                        style={{ transitionDelay: `${b.delay - 200}ms` }}
                    />
                ))}
                {BUDS.map((b, i) => (
                    <g key={i} ref={(el) => { els.current[i] = el; }} transform={`translate(${b.x} ${b.y}) scale(0)`}>
                        <FlowerArt kind={b.kind} r={b.r} />
                    </g>
                ))}
                <g ref={layer} />
            </svg>
        </div>
    );
}
