import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const OG_SIZE = { width: 1200, height: 630 };

const asset = (rel: string) => readFile(path.join(process.cwd(), 'src/assets', rel));

async function fonts() {
    const [serif, sans] = await Promise.all([asset('fonts/baskerville-400.ttf'), asset('fonts/sora-600.ttf')]);
    return [
        { name: 'Baskerville', data: serif, weight: 400 as const, style: 'normal' as const },
        { name: 'Sora', data: sans, weight: 600 as const, style: 'normal' as const },
    ];
}

/* ---------- little pieces of the garden, drawn for the cards ---------- */

const COLORS: [string, string][] = [
    ['#ff5c70', '#ffc2c9'],
    ['#ffb71a', '#ffe08a'],
    ['#ff4fa3', '#ffb3d9'],
    ['#8d5cff', '#d3bfff'],
    ['#fff4d6', '#ffffff'],
];

function Bloom({ x, y, r, k }: { x: number; y: number; r: number; k: number }) {
    const [a, b] = COLORS[k % COLORS.length];
    const n = k % 5 === 4 ? 10 : k % 5 === 1 ? 8 : 5;
    const rx = (k % 5 === 4 ? 0.16 : k % 5 === 1 ? 0.24 : 0.4) * r;
    const turns = Array.from({ length: n }, (_, i) => (i * 360) / n);
    return (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
            {turns.map((t) => (
                <ellipse key={t} cx="0" cy={-0.58 * r} rx={rx} ry={0.52 * r} fill={a} stroke="#142e39" stroke-opacity="0.28" stroke-width="1" transform={`rotate(${t})`} />
            ))}
            {turns.map((t) => (
                <ellipse key={`i${t}`} cx="0" cy={-0.34 * r} rx={rx * 0.6} ry={0.3 * r} fill={b} transform={`rotate(${t + 180 / n})`} />
            ))}
            <circle r={r * 0.2} fill="#ffd23f" stroke="#142e39" stroke-opacity="0.3" stroke-width="1" />
        </g>
    );
}

function Butterfly({ x, y, s, rot, a, b, edge }: { x: number; y: number; s: number; rot: number; a: string; b: string; edge: string }) {
    const wing = (flip: number) => (
        <g transform={`scale(${flip} 1)`}>
            <path d="M0 4 C22 2 48 6 52 24 C56 40 40 53 25 47 C12 41 4 26 0 14 Z" fill={b} stroke={edge} stroke-width="3" stroke-linejoin="round" />
            <path d="M0 -6 C8 -34 40 -58 64 -50 C77 -45 73 -24 57 -8 C45 3 22 6 0 6 Z" fill={a} stroke={edge} stroke-width="3" stroke-linejoin="round" />
            <circle cx="62" cy="-40" r="3" fill="#fff8e6" />
            <circle cx="66" cy="-29" r="2.6" fill="#fff8e6" />
            <circle cx="47" cy="25" r="2.6" fill="#fff8e6" />
        </g>
    );
    return (
        <g key={`b${x}-${y}`} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
            {wing(1)}
            {wing(-1)}
            <ellipse cx="0" cy="3" rx="3.4" ry="20" fill="#1a1020" />
            <path d="M-1 -19 Q-6 -32 -13 -38 M1 -19 Q6 -32 13 -38" stroke="#1a1020" stroke-width="1.6" fill="none" />
        </g>
    );
}

function ring(cx: number, cy: number, a: number, b: number, th: number, push: number): [number, number] {
    const c = Math.cos(th), s = Math.sin(th);
    const x = a * Math.sign(c) * Math.pow(Math.abs(c), 0.42);
    const y = b * Math.sign(s) * Math.pow(Math.abs(s), 0.42);
    const len = Math.hypot(x, y) || 1;
    return [cx + x + (x / len) * push, cy + y + (y / len) * push];
}

function Garland({ cx, cy, a, b }: { cx: number; cy: number; a: number; b: number }) {
    const vines = [0, 1].map((v) => {
        let d = '';
        for (let i = 0; i <= 150; i++) {
            const u = i / 150;
            const th = Math.PI / 2 + (v ? -1 : 1) * u * Math.PI * 2;
            const [x, y] = ring(cx, cy, a, b, th, Math.sin(u * Math.PI * 2 * 9 + v * Math.PI) * 8);
            d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
        }
        return d;
    });
    const count = 22;
    return (
        <g>
            {vines.map((d) => (
                <path key={d.slice(0, 20) + d.length} d={d} fill="none" stroke="#1f7a46" stroke-width="3.5" stroke-linecap="round" />
            ))}
            {Array.from({ length: count }, (_, i) => {
                const [x, y] = ring(cx, cy, a, b, Math.PI / 2 + ((i + 0.5) / count) * Math.PI * 2, 8);
                return Bloom({ x: x, y: y, r: i % 4 === 0 ? 22 : i % 2 ? 15 : 18, k: i * 3 + (i % 4 === 0 ? 2 : 0) });
            })}
        </g>
    );
}

/* ---------- cards ---------- */

/** The home card: the name in its garland, a meadow below, and butterflies in the sky. */
export async function siteCard({ title, line, url }: { title: string; line: string; url: string }) {
    const hill = (d: string, fill: string) => <path d={d} fill={fill} />;
    return new ImageResponse(
        (
            <div style={{ display: 'flex', position: 'relative', width: '100%', height: '100%', background: 'linear-gradient(180deg, #78bff0 0%, #cfe9fb 58%, #e9f6ff 100%)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" style={{ position: 'absolute', left: 0, top: 0 }}>
                    <circle cx="1030" cy="112" r="64" fill="#fff4b8" fill-opacity="0.9" />
                    {hill('M0 470 C180 420 330 430 520 465 C720 500 900 430 1200 455 L1200 630 L0 630Z', '#9ed68c')}
                    {hill('M0 520 C200 470 420 505 640 520 C860 535 1020 470 1200 500 L1200 630 L0 630Z', '#62b34f')}
                    {hill('M0 575 C240 540 480 580 720 575 C920 570 1060 548 1200 560 L1200 630 L0 630Z', '#2f8a43')}
                    {Garland({ cx: 600, cy: 226, a: 452, b: 88 })}
                    {[40, 118, 196, 270, 340, 430, 520, 610, 700, 790, 870, 950, 1030, 1110, 1170].map((x, i) => (
                        <g key={x}>
                            <path d={`M${x} 640 C${x + 10} 600 ${x - 8} 575 ${x} ${548 + (i % 4) * 14}`} stroke="#1f6b35" stroke-width="3" fill="none" />
                            {Bloom({ x: x, y: 548 + (i % 4) * 14, r: 14 + (i % 3) * 4, k: i * 2 + 1 })}
                        </g>
                    ))}
                    {Butterfly({ x: 130, y: 150, s: 0.55, rot: -20, a: '#ff9f1a', b: '#ff6a00', edge: '#21110c' })}
                    {Butterfly({ x: 1085, y: 350, s: 0.5, rot: 24, a: '#4fe0ff', b: '#2e6bff', edge: '#0b1233' })}
                    {Butterfly({ x: 120, y: 330, s: 0.42, rot: -6, a: '#ff6fba', b: '#c4006f', edge: '#2a0a2a' })}
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', left: 0, right: 0, top: 168 }}>
                    <div style={{ fontFamily: 'Baskerville', fontSize: 92, letterSpacing: -4, color: '#142e39', lineHeight: 1.1 }}>{title}</div>
                    <div style={{ fontFamily: 'Sora', fontSize: 27, color: '#1d4452', marginTop: 112, maxWidth: 1060, textAlign: 'center', lineHeight: 1.4 }}>{line}</div>
                </div>
                <div style={{ display: 'flex', position: 'absolute', left: 0, right: 0, bottom: 22, justifyContent: 'center', fontFamily: 'Sora', fontSize: 22, color: '#f4fff0' }}>{url}</div>
            </div>
        ),
        { ...OG_SIZE, fonts: await fonts() },
    );
}

/** A writing card: the piece's own cover art, with its title set in the open space beside it. */
export async function coverCard({ image, kind, title, ink, url }: { image: 'grace' | 'journey'; kind: string; title: string; ink: string; url: string }) {
    const data = await asset(`og/${image}.jpg`);
    const src = `data:image/jpeg;base64,${data.toString('base64')}`;
    const long = title.length > 14;
    return new ImageResponse(
        (
            <div style={{ display: 'flex', position: 'relative', width: '100%', height: '100%', background: '#e9eee4' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} width={1200} height={630} alt="" style={{ position: 'absolute', left: 0, top: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'absolute', left: 72, top: 64, bottom: 56, width: 520 }}>
                    <div style={{ display: 'flex', fontFamily: 'Sora', fontSize: 28, color: ink }}>{kind} by Prashant Chataut</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontFamily: 'Baskerville', fontSize: long ? 78 : 140, lineHeight: 1.06, letterSpacing: long ? -3 : -6, color: ink }}>{title}</div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="260" height="60" viewBox="0 0 260 60" style={{ marginTop: 34 }}>
                            <path d="M0 40 C40 10 70 62 110 34 S190 8 260 36" stroke="#1f7a46" stroke-width="3.5" fill="none" stroke-linecap="round" />
                            {Bloom({ x: 28, y: 26, r: 16, k: 0 })}
                            {Bloom({ x: 96, y: 38, r: 14, k: 1 })}
                            {Bloom({ x: 160, y: 22, r: 17, k: 2 })}
                            {Bloom({ x: 228, y: 34, r: 13, k: 3 })}
                        </svg>
                    </div>
                    <div style={{ display: 'flex', fontFamily: 'Sora', fontSize: 19, color: ink }}>{url}</div>
                </div>
            </div>
        ),
        { ...OG_SIZE, fonts: await fonts() },
    );
}
