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

/** A row of flowers growing from the landscape. They open as the footer arrives and answer to touch. */
export function FooterGarden() {
    const wrap = useRef<HTMLDivElement>(null);
    const svg = useRef<SVGSVGElement>(null);
    const layer = useRef<SVGGElement>(null);
    const els = useRef<(SVGGElement | null)[]>([]);
    const [width, setWidth] = useState(0);
    const [grown, setGrown] = useState(false);
    const HEIGHT = 190;

    useEffect(() => {
        const el = wrap.current;
        if (!el) return;
        const measure = () => setWidth(el.clientWidth);
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const buds = useMemo<Bud[]>(() => {
        if (width < 200) return [];
        const n = Math.max(6, Math.floor(width / 92));
        return Array.from({ length: n }, (_, i) => {
            const h = Math.sin(i * 12.9898) * 43758.5453;
            const rnd = h - Math.floor(h);
            const x = ((i + 0.5) / n) * width + (rnd - 0.5) * 30;
            const tall = 60 + ((i * 53) % 7) * 17;
            return { x, y: HEIGHT - tall, r: 14 + ((i * 5) % 4) * 3, kind: (i * 2 + 1) % 5, delay: 150 + Math.abs(i - n / 2) * 110, dir: i % 2 ? 1 : -1 };
        });
    }, [width]);

    useEffect(() => {
        const node = svg.current;
        if (!node || !buds.length) return;
        const io = new IntersectionObserver(([e]) => setGrown(e.isIntersecting));
        io.observe(node);
        return () => io.disconnect();
    }, [buds]);

    useEffect(() => {
        const node = svg.current, petals = layer.current;
        if (!node || !petals || !buds.length) return;
        const items: Item[] = buds.map((b, i) => ({ el: els.current[i] as SVGGElement, x: b.x, y: b.y, r: b.r, delay: b.delay, dir: b.dir, color: FLOWER_COLORS[b.kind] }));
        return new Garden(node, items, { layer: petals, turn: 0.05 }).mount();
    }, [buds]);

    return (
        <div ref={wrap} className="ft-garden" aria-hidden="true">
            {buds.length > 0 && (
                <svg ref={svg} className={grown ? 'is-grown' : undefined} width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} focusable="false">
                    {buds.map((b, i) => (
                        <path
                            key={`s${i}`}
                            className="ft-stem"
                            d={`M${b.x} ${HEIGHT + 4}C${b.x + (i % 2 ? 14 : -14)} ${HEIGHT - (HEIGHT - b.y) * 0.5} ${b.x - (i % 2 ? 10 : -10)} ${b.y + 30} ${b.x} ${b.y}`}
                            pathLength={1}
                            style={{ transitionDelay: `${b.delay - 100}ms` }}
                        />
                    ))}
                    {buds.map((b, i) => (
                        <g key={i} ref={(el) => { els.current[i] = el; }} transform={`translate(${b.x} ${b.y}) scale(0)`}>
                            <FlowerArt kind={b.kind} r={b.r} />
                        </g>
                    ))}
                    <g ref={layer} />
                </svg>
            )}
        </div>
    );
}
