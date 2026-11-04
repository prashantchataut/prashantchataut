/*
 * Shared butterfly craft: vivid painted wings, a flapping model, steering and pixie dust.
 * Wings are painted once per species into an offscreen canvas (one half of the pair, body at the left edge),
 * then drawn mirrored and squeezed on x each frame, which reads as a real top-down wingbeat.
 */

export type Species = {
    name: string;
    foreA: string; foreB: string; hindA: string; hindB: string;
    edge: string; spot: string; glow: string; tail?: boolean;
    /** Multiplier for the night/day halo. Quiet species keep it low so they never glare over the page. */
    glowScale?: number;
};

export const SPECIES: Species[] = [
    { name: 'monarch', foreA: '#ffb21a', foreB: '#ff5a00', hindA: '#ffc83a', hindB: '#ff7a00', edge: '#21110c', spot: '#fff6dc', glow: '#ff8a1f' },
    { name: 'morpho', foreA: '#5cf0ff', foreB: '#1769ff', hindA: '#2ab8ff', hindB: '#4a3dff', edge: '#0b1233', spot: '#e8fbff', glow: '#2fa4ff' },
    { name: 'orchid', foreA: '#ff7cc3', foreB: '#d6007f', hindA: '#ff4fa3', hindB: '#8e0fb8', edge: '#2a0a2a', spot: '#fff0f8', glow: '#ff3fa0' },
    { name: 'swallowtail', foreA: '#fff06a', foreB: '#ffb800', hindA: '#ffe34d', hindB: '#ff9f00', edge: '#1d1500', spot: '#fffbe0', glow: '#ffd21f', tail: true },
    { name: 'violet', foreA: '#c9a4ff', foreB: '#6d2cff', hindA: '#a07bff', hindB: '#e04bff', edge: '#170b38', spot: '#f6ecff', glow: '#a35cff' },
    { name: 'emerald', foreA: '#8dffc4', foreB: '#00b86b', hindA: '#3df2a0', hindB: '#00b8c4', edge: '#03281c', spot: '#eafff4', glow: '#2dff9d' },
];

/*
 * The pointer flutter wears a quieter set. Same painted wings, but the pigment is washed out:
 * paper, clay, sage, dust. They read as butterflies up close and as a soft mark from a distance.
 */
export const QUIET_SPECIES: Species[] = [
    { name: 'quiet-ash', foreA: '#ded8cb', foreB: '#b3aa98', hindA: '#e6e1d5', hindB: '#c0b7a4', edge: '#3c372f', spot: '#f8f5ec', glow: '#d6cdb8', glowScale: 0.42 },
    { name: 'quiet-clay', foreA: '#dcbfac', foreB: '#b48774', hindA: '#e6cdbb', hindB: '#c49b88', edge: '#402e28', spot: '#f7ede5', glow: '#d9b8a4', glowScale: 0.42 },
    { name: 'quiet-sage', foreA: '#cdd6c6', foreB: '#97a992', hindA: '#d9e0d2', hindB: '#a8b8a2', edge: '#2e372f', spot: '#f3f6ee', glow: '#c8d2c1', glowScale: 0.42 },
    { name: 'quiet-dusk', foreA: '#cdccdc', foreB: '#9a97b3', hindA: '#d8d7e4', hindB: '#aaa7c0', edge: '#2e2d3c', spot: '#f4f3f8', glow: '#cfccdc', glowScale: 0.42 },
    { name: 'quiet-wheat', foreA: '#e4d8b8', foreB: '#c3ad80', hindA: '#ece1c4', hindB: '#ceb98c', edge: '#3d3527', spot: '#fbf5e4', glow: '#e5d6b4', glowScale: 0.42 },
    { name: 'quiet-rose', foreA: '#e0cccc', foreB: '#b99396', hindA: '#e8d7d7', hindB: '#c4a0a3', edge: '#3e2f31', spot: '#faf0f0', glow: '#dfc9c9', glowScale: 0.42 },
    { name: 'quiet-moss', foreA: '#cfd2b8', foreB: '#a0a383', hindA: '#dadcc6', hindB: '#afb293', edge: '#33352a', spot: '#f5f6ea', glow: '#cbd0b2', glowScale: 0.42 },
    { name: 'quiet-slate', foreA: '#c3cbd2', foreB: '#8e9aa4', hindA: '#d0d8de', hindB: '#9faeb8', edge: '#2a3238', spot: '#f1f5f7', glow: '#c6d0d8', glowScale: 0.42 },
];

/** Fisher-Yates, so a small flock gets distinct colours without a fixed order. */
export function shuffleSpecies(list: Species[] = QUIET_SPECIES): Species[] {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

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

export function makeFly(x: number, y: number, size: number, index: number, seed: number, sp?: Species): Fly {
    return {
        x, y, vx: 0, vy: 0, heading: -Math.PI / 2, phase: seed * 6.28, size,
        sp: sp ?? SPECIES[index % SPECIES.length], seed, flap: 1, landed: false, restUntil: 0,
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

/*
 * Rendering is kept deliberately cheap. Every frame of the wingbeat (wings, body and feelers) is baked once per species
 * into its own small canvas, halos and sparkles are baked sprites too, so a butterfly costs two drawImage calls and
 * no gradients per frame. Each canvas also remembers the box it painted, and only that box is cleared next frame.
 */
const FRAMES = 14;
const KB = 0.85;
const frameCache = new Map<string, HTMLCanvasElement[]>();
const haloCache = new Map<string, HTMLCanvasElement>();
const sparkCache = new Map<string, HTMLCanvasElement>();

function frameSet(s: Species): HTMLCanvasElement[] {
    const hit = frameCache.get(s.name);
    if (hit) return hit;
    const sprite = wingSprite(s);
    const list: HTMLCanvasElement[] = [];
    for (let n = 0; n < FRAMES; n++) {
        const fx = Math.max(0.05, 0.05 + 0.95 * (n / (FRAMES - 1)));
        const c = document.createElement('canvas');
        c.width = Math.round(DW * 2 * KB);
        c.height = Math.round(DH * KB);
        const g = c.getContext('2d')!;
        g.scale(KB, KB);
        g.translate(DW, DH / 2);
        g.imageSmoothingQuality = 'high';
        g.drawImage(sprite, 0, -DH / 2, DW * fx, DH);
        g.save();
        g.scale(-1, 1);
        g.drawImage(sprite, 0, -DH / 2, DW * fx, DH);
        g.restore();
        g.fillStyle = '#1a1020';
        g.beginPath(); g.ellipse(0, 3, 3.1, 19, 0, 0, 6.2832); g.fill();
        g.beginPath(); g.arc(0, -17, 3.6, 0, 6.2832); g.fill();
        g.strokeStyle = '#1a1020';
        g.lineWidth = 1.3;
        g.lineCap = 'round';
        g.beginPath();
        g.moveTo(-1.5, -19); g.quadraticCurveTo(-6, -32, -13, -38);
        g.moveTo(1.5, -19); g.quadraticCurveTo(6, -32, 13, -38);
        g.stroke();
        g.fillStyle = s.spot;
        g.beginPath(); g.arc(-13, -38, 1.8, 0, 6.2832); g.arc(13, -38, 1.8, 0, 6.2832); g.fill();
        list.push(c);
    }
    frameCache.set(s.name, list);
    return list;
}

function haloSprite(s: Species, night: boolean): HTMLCanvasElement {
    const key = s.name + (night ? 'n' : 'd');
    const hit = haloCache.get(key);
    if (hit) return hit;
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(32, 32, 3, 32, 32, 32);
    const glow = Math.round((night ? 170 : 85) * (s.glowScale ?? 1));
    grad.addColorStop(0, s.glow + glow.toString(16).padStart(2, '0'));
    grad.addColorStop(1, s.glow + '00');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    haloCache.set(key, c);
    return c;
}

function sparkSprite(color: string): HTMLCanvasElement {
    const hit = sparkCache.get(color);
    if (hit) return hit;
    const c = document.createElement('canvas');
    c.width = c.height = 24;
    const g = c.getContext('2d')!;
    g.translate(12, 12);
    g.fillStyle = color;
    const r = 5;
    g.beginPath();
    g.moveTo(0, -r * 2);
    g.quadraticCurveTo(0, 0, r * 2, 0);
    g.quadraticCurveTo(0, 0, 0, r * 2);
    g.quadraticCurveTo(0, 0, -r * 2, 0);
    g.quadraticCurveTo(0, 0, 0, -r * 2);
    g.fill();
    sparkCache.set(color, c);
    return c;
}

type Box = { x0: number; y0: number; x1: number; y1: number };
const boxes = new WeakMap<CanvasRenderingContext2D, Box>();
function boxOf(g: CanvasRenderingContext2D): Box {
    let b = boxes.get(g);
    if (!b) { b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity }; boxes.set(g, b); }
    return b;
}
function grow(b: Box, x: number, y: number, pad: number) {
    if (x - pad < b.x0) b.x0 = x - pad;
    if (y - pad < b.y0) b.y0 = y - pad;
    if (x + pad > b.x1) b.x1 = x + pad;
    if (y + pad > b.y1) b.y1 = y + pad;
}

/** Clear only what the previous frame painted. */
export function clearDirty(g: CanvasRenderingContext2D) {
    const b = boxOf(g);
    if (b.x1 >= b.x0) g.clearRect(Math.floor(b.x0) - 2, Math.floor(b.y0) - 2, Math.ceil(b.x1 - b.x0) + 4, Math.ceil(b.y1 - b.y0) + 4);
    b.x0 = b.y0 = Infinity; b.x1 = b.y1 = -Infinity;
}

export function drawFly(g: CanvasRenderingContext2D, f: Fly, night: boolean, alpha = 1) {
    const frames = frameSet(f.sp);
    const frame = frames[Math.round(Math.max(0, Math.min(1, (f.flap - 0.05) / 0.95)) * (FRAMES - 1))];
    const s = f.size / 150;
    const halo = haloSprite(f.sp, night);
    grow(boxOf(g), f.x, f.y, f.size * 0.62 + 4);
    g.save();
    g.globalAlpha = alpha;
    g.translate(f.x, f.y);
    g.rotate(f.heading + Math.PI / 2);
    g.scale(s, s);
    if (night) g.globalCompositeOperation = 'lighter';
    g.drawImage(halo, -80, -80, 160, 160);
    g.globalCompositeOperation = 'source-over';
    g.drawImage(frame, -DW, -DH / 2, DW * 2, DH);
    g.restore();
}

export type Dust = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; color: string; spin: number };

export function emit(list: Dust[], x: number, y: number, color: string, power = 1, limit = 56) {
    if (list.length >= limit) return;
    const a = Math.random() * 6.2832;
    const v = (8 + Math.random() * 26) * power;
    list.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v + 8,
        life: 0, max: 0.7 + Math.random() * 0.9, size: 1.6 + Math.random() * 2.8, color, spin: 0,
    });
}

export function stepDust(g: CanvasRenderingContext2D, list: Dust[], dt: number) {
    if (!list.length) return;
    const b = boxOf(g);
    g.save();
    g.globalCompositeOperation = 'lighter';
    for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.life += dt;
        if (p.life >= p.max) { list[i] = list[list.length - 1]; list.pop(); continue; }
        p.vy += 22 * dt;
        p.vx *= 0.985;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const k = 1 - p.life / p.max;
        const d = p.size * (0.5 + k * 0.7) * 2.4;
        g.globalAlpha = k * 0.95;
        g.drawImage(sparkSprite(p.color), p.x - d / 2, p.y - d / 2, d, d);
        grow(b, p.x, p.y, d);
    }
    g.restore();
}

export const isNight = () => document.documentElement.dataset.theme === 'dark';

/** Minimum gap between painted frames (ms). Caps 120Hz and 144Hz screens at roughly 60fps so the wings never cost double. */
export const FRAME_MS = 15;
