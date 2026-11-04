'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import FlowerArt, { FLOWER_COLORS } from './FlowerArt';
import { Garden, type Item } from './flora';

type Flower = { x: number; y: number; r: number; kind: number; delay: number; dir: number };
type Leaf = { x: number; y: number; a: number; s: number; d: number };
type Geo = { w: number; h: number; vines: string[]; leaves: Leaf[]; flowers: Flower[] };

const MARGIN = 74;

/** A point on a rounded-rectangle ring (a superellipse) around the name. */
function ring(cx: number, cy: number, a: number, b: number, th: number, push: number): [number, number] {
    const c = Math.cos(th), s = Math.sin(th);
    const x = a * Math.sign(c) * Math.pow(Math.abs(c), 0.42);
    const y = b * Math.sign(s) * Math.pow(Math.abs(s), 0.42);
    const len = Math.hypot(x, y) || 1;
    return [cx + x + (x / len) * push, cy + y + (y / len) * push];
}

function build(w: number, h: number): Geo {
    const cx = w / 2 + MARGIN, cy = h / 2 + MARGIN;
    const a = w / 2 + 40, b = h / 2 + 12;
    const perimeter = 4 * (a + b) * 0.92;
    const count = Math.max(10, Math.min(22, Math.round(perimeter / 64)));
    const lobes = Math.max(5, Math.round(perimeter / 150));
    const start = Math.PI / 2;

    const vines: string[] = [];
    const leaves: Leaf[] = [];
    for (let v = 0; v < 2; v++) {
        const dir = v === 0 ? 1 : -1;
        let d = '';
        const steps = 190;
        for (let i = 0; i <= steps; i++) {
            const u = i / steps;
            const th = start + dir * u * Math.PI * 2;
            const wave = Math.sin(u * Math.PI * 2 * lobes + v * Math.PI) * 9;
            const [x, y] = ring(cx, cy, a, b, th, wave);
            d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
        }
        vines.push(d);
        const nLeaves = Math.round(count * 1.7);
        for (let j = 0; j < nLeaves; j++) {
            const u = (j + 0.5) / nLeaves;
            const th = start + dir * u * Math.PI * 2;
            const wave = Math.sin(u * Math.PI * 2 * lobes + v * Math.PI) * 9;
            const [x, y] = ring(cx, cy, a, b, th, wave);
            const [x2, y2] = ring(cx, cy, a, b, th + dir * 0.02, wave);
            const tangent = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
            leaves.push({ x, y, a: tangent + (j % 2 ? 52 : -52), s: 0.8 + ((j * 7) % 5) / 10, d: 0.5 + u * 1.4 });
        }
    }

    const flowers: Flower[] = [];
    for (let i = 0; i < count; i++) {
        const th = start + ((i + 0.5) / count) * Math.PI * 2;
        const big = i % 4 === 0;
        const [x, y] = ring(cx, cy, a, b, th, 6 + (i % 2 ? 6 : -2));
        flowers.push({ x, y, r: big ? 19 : i % 2 ? 13 : 15, kind: (i * 3 + (big ? 2 : 0)) % 5, delay: 450 + i * 75, dir: i % 2 ? 1 : -1 });
    }
    return { w: w + MARGIN * 2, h: h + MARGIN * 2, vines, leaves, flowers };
}

const LEAF = 'M0 0C6 -7 15 -7 22 0C15 7 6 7 0 0Z';

/**
 * The hero name, wrapped in a braided garland. The vines grow in on load, the flowers bloom one after another,
 * and then keep responding: they turn as the page scrolls, lean toward the pointer, and scatter petals when touched.
 */
export default function FloralName({ id, text }: { id: string; text: string }) {
    const label = useRef<HTMLSpanElement>(null);
    const svg = useRef<SVGSVGElement>(null);
    const layer = useRef<SVGGElement>(null);
    const els = useRef<(SVGGElement | null)[]>([]);
    const [size, setSize] = useState<{ w: number; h: number } | null>(null);
    const [grown, setGrown] = useState(false);

    useEffect(() => {
        const el = label.current;
        if (!el) return;
        const measure = () => setSize((p) => (p && p.w === el.offsetWidth && p.h === el.offsetHeight ? p : { w: el.offsetWidth, h: el.offsetHeight }));
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const geo = useMemo(() => (size && size.w > 120 ? build(size.w, size.h) : null), [size]);

    useEffect(() => {
        const node = svg.current;
        if (!node || !geo) return;
        const io = new IntersectionObserver(([e]) => setGrown(e.isIntersecting));
        io.observe(node);
        return () => io.disconnect();
    }, [geo]);

    useEffect(() => {
        const node = svg.current, petals = layer.current;
        if (!node || !petals || !geo) return;
        const items: Item[] = geo.flowers.map((f, i) => ({
            el: els.current[i] as SVGGElement, x: f.x, y: f.y, r: f.r, delay: f.delay, dir: f.dir, color: FLOWER_COLORS[f.kind],
        }));
        const garden = new Garden(node, items, { layer: petals });
        return garden.mount();
    }, [geo]);

    return (
        <h1 id={id} className="floral-name" aria-label={text}>
            <span ref={label} className="floral-text" aria-hidden="true">{text}</span>
            {geo && (
                <svg
                    ref={svg}
                    className={`floral-svg${grown ? ' is-grown' : ''}`}
                    width={geo.w}
                    height={geo.h}
                    viewBox={`0 0 ${geo.w} ${geo.h}`}
                    style={{ left: -MARGIN, top: -MARGIN }}
                    aria-hidden="true"
                    focusable="false"
                >
                    {geo.vines.map((d, i) => (
                        <path key={i} className="vine" d={d} pathLength={1} style={{ transitionDelay: `${i * 120}ms` }} />
                    ))}
                    {geo.leaves.map((l, i) => (
                        <g key={i} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.a.toFixed(0)}) scale(${l.s})`}>
                            <path className="leaf" d={LEAF} style={{ transitionDelay: `${(l.d * 1000).toFixed(0)}ms` }} />
                        </g>
                    ))}
                    {geo.flowers.map((f, i) => (
                        <g key={i} ref={(el) => { els.current[i] = el; }} transform={`translate(${f.x} ${f.y}) scale(0)`}>
                            <FlowerArt kind={f.kind} r={f.r} />
                        </g>
                    ))}
                    <g ref={layer} />
                </svg>
            )}
        </h1>
    );
}
