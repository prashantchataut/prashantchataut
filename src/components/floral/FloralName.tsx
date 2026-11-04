'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import FlowerArt, { FLOWER_COLORS } from './FlowerArt';
import { Garden, type Item } from './flora';

type Pt = [number, number];
type Flower = { x: number; y: number; r: number; kind: number; delay: number; dir: number };
type Leaf = { x: number; y: number; a: number; s: number; d: number };
type Geo = { w: number; h: number; vines: string[]; leaves: Leaf[]; flowers: Flower[] };
type Room = { w: number; h: number; left: boolean; right: boolean };

const MARGIN = 60;
const LEAF = 'M0 0C5 -5 12 -5 18 0C12 5 5 5 0 0Z';
/** Room the sprigs need beside the name. If the page has less than this, that sprig is left out. */
const NEEDS = 46;

const at = (p: Pt[], t: number): Pt => {
    const u = 1 - t;
    return [
        u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
        u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1],
    ];
};

/**
 * One slim sprig: a hairline vine rising beside the name with three small blooms and a few leaves.
 * `side` mirrors it, `kinds` picks the quiet flower shapes, `lead` offsets the bloom timing.
 */
function sprig(w: number, h: number, side: 1 | -1, kinds: number[], lead: number, geo: Geo) {
    const x0 = side === 1 ? w + 3 : -3;
    const pts: Pt[] = [
        [x0, h * 0.97],
        [x0 + side * 30, h * 0.82],
        [x0 + side * 34, h * 0.34],
        [x0 + side * 9, h * 0.02],
    ];
    const P = (t: number): [number, number] => { const [x, y] = at(pts, t); return [x + MARGIN, y + MARGIN]; };
    let d = '';
    for (let i = 0; i <= 28; i++) { const [x, y] = P(i / 28); d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); }
    geo.vines.push(d);

    [0.14, 0.28, 0.42, 0.62, 0.76].forEach((t, i) => {
        const [x, y] = P(t);
        const [x2, y2] = P(t + 0.02);
        const tan = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
        geo.leaves.push({ x, y, a: tan + (i % 2 ? 58 : -58), s: 0.55 + (i % 3) * 0.1, d: lead + 0.4 + t * 0.9 });
    });
    [
        { t: 0.5, r: 6, k: kinds[0] },
        { t: 0.78, r: 8, k: kinds[1] },
        { t: 1, r: 6.5, k: kinds[2] },
    ].forEach((f, i) => {
        const [x, y] = P(f.t);
        geo.flowers.push({ x, y, r: f.r, kind: f.k, delay: lead * 1000 + 700 + i * 260, dir: i % 2 ? 1 : -1 });
    });
}

function build(room: Room): Geo {
    const geo: Geo = { w: room.w + MARGIN * 2, h: room.h + MARGIN * 2, vines: [], leaves: [], flowers: [] };
    if (room.left) sprig(room.w, room.h, -1, [4, 2, 1], 0, geo);
    if (room.right) sprig(room.w, room.h, 1, [1, 3, 4], 0.25, geo);
    return geo;
}

/**
 * The hero name with two slim sprigs growing beside it. They draw themselves on load, the blooms open one by one,
 * then keep responding: they turn as the page scrolls, lean toward the pointer and scatter petals when touched.
 * Nothing overlaps the letters or the line underneath.
 */
export default function FloralName({ id, text }: { id: string; text: string }) {
    const label = useRef<HTMLSpanElement>(null);
    const svg = useRef<SVGSVGElement>(null);
    const layer = useRef<SVGGElement>(null);
    const els = useRef<(SVGGElement | null)[]>([]);
    const [room, setRoom] = useState<Room | null>(null);
    const [grown, setGrown] = useState(false);

    useEffect(() => {
        const el = label.current;
        if (!el) return;
        const measure = () => {
            const r = el.getBoundingClientRect();
            const next: Room = { w: el.offsetWidth, h: el.offsetHeight, left: r.left >= NEEDS, right: innerWidth - r.right >= NEEDS };
            setRoom((p) => (p && p.w === next.w && p.h === next.h && p.left === next.left && p.right === next.right ? p : next));
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        addEventListener('resize', measure);
        return () => { ro.disconnect(); removeEventListener('resize', measure); };
    }, []);

    const geo = useMemo(() => (room && room.w > 120 && (room.left || room.right) ? build(room) : null), [room]);

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
        return new Garden(node, items, { layer: petals }).mount();
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
                        <path key={i} className="vine" d={d} pathLength={1} style={{ transitionDelay: `${i * 250}ms` }} />
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
