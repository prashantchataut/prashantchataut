/*
 * Shared butterfly craft: vivid painted wings, a flapping model, steering and pixie dust.
 * Wings are painted once per species into an offscreen canvas (one half of the pair, body at the left edge),
 * then drawn mirrored and squeezed on x each frame, which reads as a real top-down wingbeat.
 */

export type Species = {
    name: string;
    foreA: string; foreB: string; hindA: string; hindB: string;
    edge: string; spot: string; glow: string; tail?: boolean;
};

export const SPECIES: Species[] = [
    { name: 'monarch', foreA: '#ffb21a', foreB: '#ff5a00', hindA: '#ffc83a', hindB: '#ff7a00', edge: '#21110c', spot: '#fff6dc', glow: '#ff8a1f' },
    { name: 'morpho', foreA: '#5cf0ff', foreB: '#1769ff', hindA: '#2ab8ff', hindB: '#4a3dff', edge: '#0b1233', spot: '#e8fbff', glow: '#2fa4ff' },
    { name: 'orchid', foreA: '#ff7cc3', foreB: '#d6007f', hindA: '#ff4fa3', hindB: '#8e0fb8', edge: '#2a0a2a', spot: '#fff0f8', glow: '#ff3fa0' },
    { name: 'swallowtail', foreA: '#fff06a', foreB: '#ffb800', hindA: '#ffe34d', hindB: '#ff9f00', edge: '#1d1500', spot: '#fffbe0', glow: '#ffd21f', tail: true },
    { name: 'violet', foreA: '#c9a4ff', foreB: '#6d2cff', hindA: '#a07bff', hindB: '#e04bff', edge: '#170b38', spot: '#f6ecff', glow: '#a35cff' },
    { name: 'emerald', foreA: '#8dffc4', foreB: '#00b86b', hindA: '#3df2a0', hindB: '#00b8c4', edge: '#03281c', spot: '#eafff4', glow: '#2dff9d' },
];

const K = 1.6;
const DW = 80;
const DH = 120;
const cache = new Map<string, HTMLCanvasElement>();

export function wingSprite(s: Species): HTMLCanvasElement {
    const hit = cache.get(s.name);
    if (hit) return hit;
    const c = document.createElement('canvas');
    c.width = Math.round(DW * K);
    c.height = Math.round(DH * K);
    const g = c.getContext('2d')!;
    g.scale(K, K);
    g.translate(0, DH / 2);

    const fore = new Path2D('M0 -6 C8 -34 40 -58 64 -50 C77 -45 73 -24 57 -8 C45 3 22 6 0 6 Z');
    const hind = new Path2D(
        s.tail
            ? 'M0 4 C22 2 48 6 52 24 C55 36 46 44 40 54 C47 60 36 63 31 57 C26 52 22 48 18 44 C10 38 3 26 0 14 Z'
            : 'M0 4 C22 2 48 6 52 24 C56 40 40 53 25 47 C12 41 4 26 0 14 Z',
    );

    const paint = (
        path: Path2D, a: string, b: string, y0: number, y1: number,
        veins: [number, number][], origin: [number, number], spots: [number, number, number][],
    ) => {
        const grad = g.createLinearGradient(0, y0, 70, y1);
        grad.addColorStop(0, a);
        grad.addColorStop(1, b);
        g.fillStyle = grad;
        g.fill(path);
        g.save();
        g.clip(path);
        g.strokeStyle = 'rgba(20,8,16,.34)';
        g.lineWidth = 0.9;
        for (const [vx, vy] of veins) {
            g.beginPath();
            g.moveTo(origin[0], origin[1]);
            g.quadraticCurveTo((origin[0] + vx) / 2, (origin[1] + vy) / 2 - 4, vx, vy);
            g.stroke();
        }
        const sheen = g.createLinearGradient(6, y0, 52, y1 + 10);
        sheen.addColorStop(0, 'rgba(255,255,255,.55)');
        sheen.addColorStop(0.45, 'rgba(255,255,255,0)');
        g.fillStyle = sheen;
        g.fill(path);
        g.strokeStyle = s.edge;
        g.globalAlpha = 0.92;
        g.lineWidth = 10;
        g.lineJoin = 'round';
        g.stroke(path);
        g.restore();
        g.strokeStyle = s.edge;
        g.lineWidth = 1.6;
        g.lineJoin = 'round';
        g.stroke(path);
        g.fillStyle = s.spot;
        for (const [sx, sy, r] of spots) {
            g.beginPath();
            g.arc(sx, sy, r, 0, 6.2832);
            g.fill();
        }
    };

    paint(hind, s.hindA, s.hindB, -4, 50,
        [[50, 16], [52, 30], [44, 46], [28, 48], [12, 36]], [2, 8],
        [[47, 22, 2.3], [45, 35, 2.1], [35, 44, 1.9], [21, 40, 1.7]]);
    paint(fore, s.foreA, s.foreB, -50, 6,
        [[64, -50], [70, -38], [68, -24], [58, -9], [40, 2]], [2, 0],
        [[63, -42, 2.6], [67, -32, 2.2], [64, -21, 2.4], [55, -12, 2]]);

    cache.set(s.name, c);
    return c;
}

export type Fly = {
    x: number; y: number; vx: number; vy: number; heading: number;
    phase: number; size: number; sp: Species; seed: number; flap: number;
    landed: boolean; restUntil: number; tx: number; ty: number;
    ang: number; radius: number; spin: number;
};

export function makeFly(x: number, y: number, size: number, index: number, seed: number): Fly {
    return {
        x, y, vx: 0, vy: 0, heading: -Math.PI / 2, phase: seed * 6.28, size,
        sp: SPECIES[index % SPECIES.length], seed, flap: 1, landed: false, restUntil: 0,
        tx: x, ty: y, ang: seed * 6.28, radius: 34 + seed * 46, spin: (seed > 0.5 ? 1 : -1) * (0.5 + seed * 0.7),
    };
}

const lerpAngle = (a: number, b: number, k: number) => {
    let d = (b - a) % 6.2832;
    if (d > Math.PI) d -= 6.2832;
    if (d < -Math.PI) d += 6.2832;
    return a + d * k;
};

/** Steer toward a point with a lazy side-to-side meander and a wingbeat bob. */
export function fly(f: Fly, tx: number, ty: number, dt: number, t: number, top: number) {
    const dx = tx - f.x, dy = ty - f.y;
    const d = Math.hypot(dx, dy) || 1;
    const speed = top * Math.min(1, d / 110);
    const nx = dx / d, ny = dy / d;
    const wob = Math.sin(t * 2.6 + f.seed * 9) * 0.55;
    const k = Math.min(1, dt * 2.8);
    f.vx += (nx * speed - ny * wob * speed * 0.5 - f.vx) * k;
    f.vy += (ny * speed + nx * wob * speed * 0.5 - f.vy) * k;
    f.vy += Math.sin(f.phase * 2) * 240 * dt;
    f.x += f.vx * dt;
    f.y += f.vy * dt;
    const sp = Math.hypot(f.vx, f.vy);
    if (sp > 18) f.heading = lerpAngle(f.heading, Math.atan2(f.vy, f.vx), Math.min(1, dt * 6));
    f.phase += (10 + Math.min(1, sp / 260) * 8) * dt;
    f.flap = 0.16 + 0.84 * Math.abs(Math.cos(f.phase));
}

/** Wings slowly opening and closing while perched. */
export function perch(f: Fly, dt: number) {
    f.vx *= 0.9; f.vy *= 0.9;
    f.phase += 2.4 * dt;
    f.flap = 0.42 + 0.58 * (0.5 + 0.5 * Math.cos(f.phase));
    f.heading = lerpAngle(f.heading, -Math.PI / 2 + Math.sin(f.phase * 0.5) * 0.18, Math.min(1, dt * 3));
}

export function drawFly(g: CanvasRenderingContext2D, f: Fly, night: boolean, alpha = 1) {
    const sprite = wingSprite(f.sp);
    const s = f.size / 150;
    g.save();
    g.globalAlpha = alpha;
    g.translate(f.x, f.y);
    g.rotate(f.heading + Math.PI / 2);
    g.scale(s, s);

    const halo = g.createRadialGradient(0, 0, 4, 0, 0, 92);
    halo.addColorStop(0, night ? f.sp.glow + 'aa' : f.sp.glow + '55');
    halo.addColorStop(1, f.sp.glow + '00');
    g.globalCompositeOperation = night ? 'lighter' : 'source-over';
    g.fillStyle = halo;
    g.beginPath();
    g.arc(0, 0, 92, 0, 6.2832);
    g.fill();
    g.globalCompositeOperation = 'source-over';

    const fx = Math.max(0.05, f.flap);
    g.imageSmoothingQuality = 'high';
    g.drawImage(sprite, 0, -DH / 2, DW * fx, DH);
    g.save();
    g.scale(-1, 1);
    g.drawImage(sprite, 0, -DH / 2, DW * fx, DH);
    g.restore();

    g.fillStyle = '#1a1020';
    g.beginPath();
    g.ellipse(0, 3, 3.1, 19, 0, 0, 6.2832);
    g.fill();
    g.beginPath();
    g.arc(0, -17, 3.6, 0, 6.2832);
    g.fill();
    g.strokeStyle = '#1a1020';
    g.lineWidth = 1.3;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(-1.5, -19); g.quadraticCurveTo(-6, -32, -13, -38);
    g.moveTo(1.5, -19); g.quadraticCurveTo(6, -32, 13, -38);
    g.stroke();
    g.fillStyle = f.sp.spot;
    g.beginPath();
    g.arc(-13, -38, 1.8, 0, 6.2832);
    g.arc(13, -38, 1.8, 0, 6.2832);
    g.fill();
    g.restore();
}

export type Dust = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; color: string; spin: number };

export function emit(list: Dust[], x: number, y: number, color: string, power = 1, limit = 140) {
    if (list.length >= limit) return;
    const a = Math.random() * 6.2832;
    const v = (8 + Math.random() * 26) * power;
    list.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v + 8,
        life: 0, max: 0.7 + Math.random() * 0.9, size: 1.6 + Math.random() * 2.8, color, spin: Math.random() * 6.28,
    });
}

export function stepDust(g: CanvasRenderingContext2D, list: Dust[], dt: number) {
    g.save();
    g.globalCompositeOperation = 'lighter';
    for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.life += dt;
        if (p.life >= p.max) { list.splice(i, 1); continue; }
        p.vy += 22 * dt;
        p.vx *= 0.985;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.spin += dt * 5;
        const k = 1 - p.life / p.max;
        g.globalAlpha = k * 0.95;
        g.fillStyle = p.color;
        const r = p.size * (0.5 + k * 0.7);
        g.beginPath();
        g.moveTo(p.x, p.y - r * 1.8);
        g.quadraticCurveTo(p.x, p.y, p.x + r * 1.8, p.y);
        g.quadraticCurveTo(p.x, p.y, p.x, p.y + r * 1.8);
        g.quadraticCurveTo(p.x, p.y, p.x - r * 1.8, p.y);
        g.quadraticCurveTo(p.x, p.y, p.x, p.y - r * 1.8);
        g.fill();
    }
    g.restore();
}

export const isNight = () => document.documentElement.dataset.theme === 'dark';
