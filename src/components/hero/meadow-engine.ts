/*
 * The hero scene. A low-resolution canvas scaled up with crisp pixels paints the sky,
 * ordered-dither clouds, three hills and a meadow where each plant is one day of GitHub activity.
 * A second, full-resolution canvas stitches the lace flourishes in, cell by cell.
 * Everything pauses off screen, and a single still frame is drawn for reduced motion.
 */
import { DAY, NIGHT, KEYS, hexToRgb, type Key } from '@/components/pixel/palette';
import { PLANTS, BUTTERFLY, kindFor, type Sprite } from '@/components/pixel/sprites';
import { buildOrnament, type Cell } from '@/components/pixel/ornament';

export type Day = { date: string; count: number };
type Options = {
    root: HTMLElement;
    scene: HTMLCanvasElement;
    stitch: HTMLCanvasElement;
    tip: HTMLElement;
    text: HTMLElement | null;
    days: Day[] | null;
};
type Plant = {
    x: number; base: number; row: number; sprite: Sprite; mirror: boolean;
    count: number; date: string | null; top: number; left: number; right: number; phase: number;
};
type Fly = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; rest: number; plant: Plant | null; wing: Key; phase: number; gone: boolean };
type Mote = { x: number; y: number; vx: number; vy: number; ph: number; c: Key };
type Firefly = { x: number; y: number; ax: number; ay: number; ph: number; w: number };

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
const bayer = (x: number, y: number) => BAYER[(y & 3) * 4 + (x & 3)];
const IDX = Object.fromEntries(KEYS.map((k, i) => [k, i])) as Record<Key, number>;
const DAY_RGB = KEYS.map(k => hexToRgb(DAY[k]));
const NIGHT_RGB = KEYS.map(k => hexToRgb(NIGHT[k]));
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

function hash(x: number, y: number, seed: number) {
    let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 1103515245)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function noise(x: number, y: number, period: number, seed: number) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const x0 = ((xi % period) + period) % period, x1 = (x0 + 1) % period;
    const a = hash(x0, yi, seed), b = hash(x1, yi, seed), c = hash(x0, yi + 1, seed), d = hash(x1, yi + 1, seed);
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x: number, y: number, period: number, seed: number) {
    let v = 0, amp = 0.55, f = 1, n = 0;
    for (let o = 0; o < 4; o++) { v += amp * noise(x * f, y * f, period * f, seed + o * 31); n += amp; amp *= 0.5; f *= 2; }
    return v / n;
}
function random(seed: number) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const isNight = () => document.documentElement.dataset.theme === 'dark';
const pack = (r: number, g: number, b: number) => ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
const dateLabel = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export function startMeadow(o: Options) {
    const ctx = o.scene.getContext('2d', { alpha: false });
    const sctx = o.stitch.getContext('2d');
    if (!ctx || !sctx) return () => {};
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rand = random(1793);

    let W = 0, H = 0, P = 4, w = 0, h = 0, dpr = 1;
    let image: ImageData | null = null, buf = new Uint32Array(0);
    const pal = new Uint32Array(KEYS.length);
    const rgb: number[][] = KEYS.map(() => [0, 0, 0]);
    let night = isNight() ? 1 : 0, nightTarget = night, palNight = -1;

    let horizon = 0, capLeft = 0, capRight = 0, capY = 0, dissolve = 6;
    let farTop = new Int16Array(0), midTop = new Int16Array(0), nearTop = new Int16Array(0);
    let tileW = 0, cloudNear = new Float32Array(0), cloudFar = new Float32Array(0);
    let stars: { x: number; y: number; big: boolean; ph: number }[] = [];
    let plants: Plant[] = [];
    let flies: Fly[] = [], motes: Mote[] = [], fireflies: Firefly[] = [];
    let meteor: { x: number; y: number; life: number } | null = null, nextMeteor = 6;
    let hovered: Plant | null = null;
    let pointer = { x: -999, y: -999, inside: false };
    let gust = { x: 0, s: 0 };
    let scrollY = window.scrollY;
    let running = false, raf = 0, last = 0, clock = 0;

    // stitch canvas state
    let cells: Cell[] = [], cellsR: Cell[] = [], C = 5, oxL = 0, oxR = 0, oy = 0, ocols = 0;
    let stitchStart = -1, stitchDone = reduced, glintAt = 7;

    function updatePalette() {
        if (palNight === night) return;
        palNight = night;
        for (let i = 0; i < KEYS.length; i++) {
            const a = DAY_RGB[i], b = NIGHT_RGB[i];
            const r = Math.round(a[0] + (b[0] - a[0]) * night), g = Math.round(a[1] + (b[1] - a[1]) * night), bl = Math.round(a[2] + (b[2] - a[2]) * night);
            rgb[i][0] = r; rgb[i][1] = g; rgb[i][2] = bl;
            pal[i] = pack(r, g, bl);
        }
    }

    function layout() {
        const rect = o.root.getBoundingClientRect();
        W = Math.max(1, Math.round(rect.width)); H = Math.max(1, Math.round(rect.height));
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        P = W >= 1000 ? 4 : W >= 600 ? 3 : 2;
        w = Math.ceil(W / P); h = Math.ceil(H / P);
        o.scene.width = w; o.scene.height = h;
        o.scene.style.width = w * P + 'px'; o.scene.style.height = h * P + 'px';
        image = ctx!.createImageData(w, h); buf = new Uint32Array(image.data.buffer);
        palNight = -1;

        // keep the sky behind the words clear of clouds
        const textRect = o.text?.getBoundingClientRect();
        capY = textRect ? Math.ceil((textRect.bottom - rect.top) / P) + 2 : Math.round(h * 0.5);
        capLeft = textRect ? Math.floor((textRect.left - rect.left) / P) : 0;
        capRight = textRect ? Math.ceil((textRect.right - rect.left) / P) : w;

        horizon = Math.round(h * (W < 600 ? 0.7 : 0.66));
        dissolve = W < 600 ? 5 : 7;
        farTop = new Int16Array(w); midTop = new Int16Array(w); nearTop = new Int16Array(w);
        for (let x = 0; x < w; x++) {
            const u = x / w;
            farTop[x] = Math.round(horizon - h * (0.025 + 0.03 * Math.sin(u * 5.1 + 0.7) + 0.012 * Math.sin(u * 13 + 2)));
            midTop[x] = Math.round(horizon + h * (0.05 + 0.045 * Math.cos(u * 3.2 - 0.5) + 0.01 * Math.sin(u * 9 + 1)));
            nearTop[x] = Math.round(horizon + h * (0.135 + 0.028 * Math.sin(u * 2.3 + 2.4) + 0.008 * Math.sin(u * 7.3)));
        }

        // cloud fields: a tile twice the width of the scene that wraps
        tileW = Math.max(w * 2, 400);
        cloudNear = new Float32Array(tileW * h); cloudFar = new Float32Array(tileW * h);
        const cell = Math.max(48, Math.round(tileW / 7));
        const periodN = Math.round(tileW / cell), periodF = periodN * 2;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < tileW; x++) {
                cloudNear[y * tileW + x] = fbm(x / cell, y / (cell * 0.62), periodN, 11);
                cloudFar[y * tileW + x] = fbm(x / (cell / 2), y / (cell * 0.3), periodF, 47);
            }
        }

        stars = [];
        const starCount = Math.round((w * horizon) / 260);
        for (let i = 0; i < starCount; i++) stars.push({ x: Math.floor(rand() * w), y: Math.floor(rand() * horizon * 0.85), big: rand() < 0.12, ph: rand() * 6.28 });

        buildPlants();
        buildCritters();
        layoutStitch(rect, textRect);
    }

    function buildPlants() {
        plants = [];
        let data: { date: string | null; count: number }[] = o.days ? o.days : [];
        if (!o.days) {
            // no data: a quiet decorative meadow with no dates attached
            for (let i = 0; i < 364; i++) { const r = rand(); data.push({ date: null, count: r < 0.4 ? 0 : r < 0.75 ? 2 : r < 0.9 ? 4 : r < 0.97 ? 8 : 14 }); }
        }
        const first = data[0]?.date ? new Date(data[0].date + 'T00:00:00Z').getUTCDay() : 0;
        const weeks = Math.ceil((data.length + first) / 7);
        const margin = Math.max(3, Math.round(w * 0.02));
        const span = w - margin * 2;
        const band = h - dissolve - 3 - (Math.max(...Array.from(nearTop)) + 4);
        const gap = Math.max(2, Math.min(5, Math.floor(band / 7)));
        data.forEach((d, i) => {
            const slot = i + first;
            const col = Math.floor(slot / 7), row = slot % 7;
            const jitter = (hash(i, 7, 3) - 0.5) * (span / weeks) * 0.7;
            const x = Math.round(margin + ((col + 0.5 + (row % 2) * 0.35) / weeks) * span + jitter);
            const xi = clamp(x, 0, w - 1);
            const base = nearTop[xi] + 4 + row * gap;
            const set = PLANTS[kindFor(d.count)];
            const sprite = set[Math.floor(hash(i, 1, 9) * set.length)];
            const sw = sprite[0].length;
            plants.push({ x: xi, base, row, sprite, mirror: hash(i, 2, 5) < 0.5, count: d.count, date: d.date, top: base - sprite.length + 1, left: xi - (sw >> 1), right: xi - (sw >> 1) + sw - 1, phase: hash(i, 4, 2) * 6.28 });
        });
        plants.sort((a, b) => a.base - b.base || a.x - b.x);
    }

    function buildCritters() {
        const small = w < 260;
        flies = Array.from({ length: small ? 1 : 2 }, (_, i) => ({ x: rand() * w, y: horizon + rand() * 10, vx: 0, vy: 0, tx: rand() * w, ty: horizon, rest: 0, plant: null, wing: (i % 2 ? 'wing2' : 'wing') as Key, phase: rand() * 6, gone: false }));
        motes = Array.from({ length: small ? 6 : 11 }, () => spawnMote(true));
        fireflies = Array.from({ length: small ? 9 : 18 }, () => ({ x: rand() * w, y: horizon - 6 + rand() * (h - horizon), ax: rand() * 6.28, ay: rand() * 6.28, ph: rand() * 6.28, w: 0.8 + rand() * 1.6 }));
    }
    function spawnMote(initial = false): Mote {
        return { x: initial ? rand() * w : -2 - rand() * 20, y: rand() * horizon * 0.95, vx: 3 + rand() * 5, vy: 1 + rand() * 2.2, ph: rand() * 6.28, c: rand() < 0.65 ? 'petal' : 'petal2' };
    }

    function layoutStitch(rect: DOMRect, textRect?: DOMRect) {
        o.stitch.width = Math.round(W * dpr); o.stitch.height = Math.round(H * dpr);
        o.stitch.style.width = W + 'px'; o.stitch.style.height = H + 'px';
        const compact = W < 820;
        C = W >= 1180 ? 5 : W >= 820 ? 4 : 3;
        const gutter = W >= 1180 ? 28 : compact ? 10 : 18;
        oy = compact ? 66 : 86;
        const bottom = compact
            ? (textRect ? textRect.top - rect.top - 4 : H * 0.3)
            : (nearTop[Math.round(w * 0.06)] * P + 18);
        const rows = Math.floor((bottom - oy) / C);
        const room = textRect ? (textRect.left - rect.left - gutter - 12) / C : 34;
        ocols = Math.floor(Math.min(compact ? 20 : 34, room));
        if (rows < 26 || ocols < 12) { cells = []; cellsR = []; return; }
        cells = buildOrnament(ocols, rows, compact || rows < 70);
        cellsR = cells;
        oxL = gutter; oxR = W - gutter - ocols * C;
    }

    // ---------- painting ----------

    function put(x: number, y: number, k: Key) {
        if (x < 0 || y < 0 || x >= w || y >= h) return;
        buf[y * w + x] = pal[IDX[k]];
    }
    function blend(x: number, y: number, k: Key, a: number) {
        if (a <= 0 || x < 0 || y < 0 || x >= w || y >= h) return;
        const i = y * w + x, v = buf[i];
        const c = rgb[IDX[k]];
        const r = v & 255, g = (v >> 8) & 255, b = (v >> 16) & 255;
        buf[i] = pack(Math.round(r + (c[0] - r) * a), Math.round(g + (c[1] - g) * a), Math.round(b + (c[2] - b) * a));
    }

    function paintWorld(t: number) {
        const offN = Math.floor(t * 0.9) % tileW, offF = Math.floor(t * 0.4) % tileW;
        const sc = Math.min(scrollY, H);
        const pFar = Math.floor((sc / P) * 0.22), pMid = Math.floor((sc / P) * 0.1);
        const sky0 = IDX.sky0, skyBottom = horizon + pFar;
        const cL = pal[IDX.cloudLight], cM = pal[IDX.cloudMid], cS = pal[IDX.cloudShade], fL = pal[IDX.farLight], fS = pal[IDX.farShade];
        const hfL = pal[IDX.hillFarLight], hf = pal[IDX.hillFar], hmL = pal[IDX.hillMidLight], hm = pal[IDX.hillMid];
        const hnL = pal[IDX.hillNearLight], hn = pal[IDX.hillNear], hnD = pal[IDX.hillNearDark], speck = pal[IDX.speck], paper = pal[IDX.paper];
        const sideTop = Math.round(h * 0.2);
        const margin = Math.max(6, Math.round(w * 0.05));

        for (let y = 0; y < h; y++) {
            const g = clamp(y / skyBottom, 0, 1) * 3;
            const row = y * w;
            for (let x = 0; x < w; x++) {
                const bx = bayer(x, y);
                const i = row + x;
                const nt = nearTop[x];
                if (y >= nt) {
                    const d = y - nt;
                    let c = d < 2 ? hnL : d < 5 && bx < 0.5 ? hnL : hn;
                    const fromBottom = h - y;
                    if (fromBottom < 26 && bx < (26 - fromBottom) / 30) c = hnD;
                    if (c === hn && hash(x, y, 77) < 0.035) c = speck;
                    if (fromBottom <= dissolve && bx < (dissolve - fromBottom + 1) / (dissolve + 1)) c = paper;
                    buf[i] = c; continue;
                }
                const mt = midTop[x] + pMid;
                if (y >= mt) {
                    const d = y - mt;
                    let c = d < 1 || (d < 3 && bx < 0.45) ? hmL : hm;
                    if (c === hm && hash(x, y - pMid, 41) < 0.03) c = speck;
                    buf[i] = c; continue;
                }
                const ft = farTop[x] + pFar;
                if (y >= ft) { buf[i] = y - ft < 1 || (y - ft < 2 && bx < 0.5) ? hfL : hf; continue; }

                // clouds rise from the horizon; above the words the sky stays open
                const inText = x > capLeft - margin && x < capRight + margin;
                let cap = inText ? capY : sideTop;
                if (!inText) {
                    const edge = Math.min(Math.abs(x - (capLeft - margin)), Math.abs(x - (capRight + margin)));
                    cap = Math.round(sideTop + (capY - sideTop) * (1 - smooth(0, margin * 1.6, edge)));
                }
                const lift = 1 - smooth(cap, cap + 16, y);
                const sxN = (x + offN) % tileW;
                const dn = cloudNear[y * tileW + sxN] - lift * 0.75 - (1 - smooth(skyBottom - 40, skyBottom, y)) * 0.06 + 0.04;
                if (dn > 0.5 + (bx - 0.5) * 0.07) {
                    const up = y >= 3 ? cloudNear[(y - 3) * tileW + ((sxN - 2 + tileW) % tileW)] : 0;
                    const tone = 0.42 + (dn - up) * 4.2 + (dn - 0.5) * 1.6 + (bx - 0.5) * 0.4;
                    buf[i] = tone > 0.72 ? cL : tone > 0.34 ? cM : cS; continue;
                }
                const sxF = (x + offF) % tileW;
                const df = cloudFar[y * tileW + sxF] - lift * 0.8 - (1 - smooth(skyBottom - 26, skyBottom - 4, y)) * 0.3;
                if (df > 0.52 + (bx - 0.5) * 0.06) { buf[i] = df > 0.6 ? fL : fS; continue; }

                buf[i] = pal[sky0 + clamp(Math.floor(g + bx - 0.5), 0, 3)];
            }
        }

        if (night > 0.02) {
            for (const s of stars) {
                const y = s.y + pFar;
                const i = y * w + s.x;
                if (y >= h || buf[i] !== pal[sky0 + clamp(Math.floor(clamp(y / skyBottom, 0, 1) * 3 + bayer(s.x, y) - 0.5), 0, 3)]) continue;
                const tw = reduced ? 0.8 : 0.55 + 0.45 * Math.sin(t * (s.big ? 1.3 : 2.1) + s.ph);
                blend(s.x, y, 'star', night * tw);
                if (s.big) { const a = night * tw * 0.45; blend(s.x - 1, y, 'star', a); blend(s.x + 1, y, 'star', a); blend(s.x, y - 1, 'star', a); blend(s.x, y + 1, 'star', a); }
            }
        }
    }

    function windAt(x: number, t: number) {
        const g = gust.s * Math.exp(-(((x - gust.x) / 16) ** 2));
        return Math.sin(t * 1.25 - x * 0.075) * 0.55 + Math.sin(t * 0.63 - x * 0.021 + 1.7) * 0.35 + g;
    }

    function paintPlants(t: number) {
        const near = pointer.inside ? pointer : null;
        for (const p of plants) {
            let dx = 0;
            if (!reduced) {
                const wv = windAt(p.x, t) + Math.sin(t * 2 + p.phase) * 0.12;
                dx = wv > 0.62 ? 1 : wv < -0.62 ? -1 : 0;
                if (near && Math.abs(near.x - p.x) < 5 && near.y > p.top - 6 && near.y < p.base + 3) dx = near.x > p.x ? -1 : 1;
            }
            drawSprite(p, dx, p === hovered);
        }
    }
    function drawSprite(p: Plant, dx: number, lit: boolean) {
        const sp = p.sprite, sh = sp.length, sw = sp[0].length;
        const lean = Math.ceil(sh * 0.5);
        if (lit) {
            for (let r = 0; r < sh; r++) for (let c = 0; c < sw; c++) {
                const ch = sp[r][p.mirror ? sw - 1 - c : c];
                if (ch === '.') continue;
                const x = p.left + c + (r < lean ? dx : 0), y = p.top + r;
                put(x - 1, y, 'outline'); put(x + 1, y, 'outline'); put(x, y - 1, 'outline');
            }
        }
        for (let r = 0; r < sh; r++) for (let c = 0; c < sw; c++) {
            const ch = sp[r][p.mirror ? sw - 1 - c : c];
            if (ch === '.') continue;
            put(p.left + c + (r < lean ? dx : 0), p.top + r, ch as Key);
        }
    }

    function stepCritters(t: number, dt: number) {
        const day = 1 - night;
        // butterflies visit the busiest days
        const blooms = plants.filter(p => p.count >= 6);
        for (const f of flies) {
            if (night > 0.5) { f.gone = true; f.plant = null; continue; }
            if (f.gone) { f.gone = false; f.x = rand() < 0.5 ? -4 : w + 4; f.y = horizon - 10; f.rest = 0; f.plant = null; f.tx = rand() * w; f.ty = horizon; }
            if (f.rest > t) continue;
            const dxp = f.tx - f.x, dyp = f.ty - f.y;
            const dist = Math.hypot(dxp, dyp);
            if (dist < 1.5) {
                if (f.plant) { f.rest = t + 2 + rand() * 4; f.x = f.plant.x; f.y = f.plant.top - 1; }
                const curious = pointer.inside && rand() < 0.35;
                const target = !curious && blooms.length && rand() < 0.7 ? blooms[Math.floor(rand() * blooms.length)] : null;
                f.plant = target;
                f.tx = target ? target.x : curious ? pointer.x + (rand() - 0.5) * 10 : rand() * w;
                f.ty = target ? target.top - 1 : curious ? pointer.y - 4 - rand() * 6 : capY + rand() * Math.max(4, horizon - capY);
                continue;
            }
            const speed = 16;
            f.vx += ((dxp / dist) * speed - f.vx) * Math.min(1, dt * 2.2) + Math.sin(t * 7 + f.phase) * 0.9;
            f.vy += ((dyp / dist) * speed - f.vy) * Math.min(1, dt * 2.2) + Math.cos(t * 9 + f.phase) * 1.4;
            f.x += f.vx * dt; f.y += f.vy * dt;
        }
        for (const m of motes) {
            m.x += (m.vx + windAt(m.x, t) * 2.5) * dt;
            m.y += (m.vy + Math.sin(t * 2 + m.ph) * 2.2) * dt;
            const xi = Math.floor(m.x);
            if (m.x > w + 2 || (xi >= 0 && xi < w && m.y > nearTop[xi])) Object.assign(m, spawnMote());
        }
        for (const f of fireflies) {
            f.ax += dt * 0.6 * f.w; f.ay += dt * 0.45 * f.w;
            f.x += Math.cos(f.ax) * dt * 2.2; f.y += Math.sin(f.ay) * dt * 1.4;
            if (f.x < 0) f.x += w; if (f.x >= w) f.x -= w;
        }
        if (night > 0.85 && !meteor && t > nextMeteor) meteor = { x: w * (0.15 + rand() * 0.55), y: h * (0.05 + rand() * 0.2), life: 0 };
        if (meteor) { meteor.life += dt; meteor.x += dt * 70; meteor.y += dt * 30; if (meteor.life > 0.85) { meteor = null; nextMeteor = t + 9 + rand() * 14; } }
        void day;
    }

    function paintCritters(t: number) {
        const day = 1 - night;
        if (day > 0.02) for (const m of motes) blend(Math.floor(m.x), Math.floor(m.y), m.c, day * 0.9);
        for (const f of flies) {
            if (f.gone) continue;
            const resting = f.rest > t;
            const frame = resting ? (Math.sin(t * 2.4 + f.phase) > 0.7 ? 0 : 2) : Math.floor(t * 11 + f.phase) % 2;
            const sp = BUTTERFLY[frame];
            const x0 = Math.round(f.x) - 2, y0 = Math.round(f.y) - sp.length + 1;
            for (let r = 0; r < sp.length; r++) for (let c = 0; c < 5; c++) {
                const ch = sp[r][c];
                if (ch === '.') continue;
                put(x0 + c, y0 + r, ch === 'b' ? 'body' : f.wing);
            }
        }
        if (night > 0.02) {
            for (const f of fireflies) {
                const b = reduced ? 0.6 : Math.max(0, Math.sin(t * f.w * 1.6 + f.ph)) ** 3;
                if (b < 0.02) continue;
                const x = Math.round(f.x), y = Math.round(f.y), a = night * b;
                blend(x, y, 'firefly', a);
                blend(x - 1, y, 'firefly', a * 0.35); blend(x + 1, y, 'firefly', a * 0.35); blend(x, y - 1, 'firefly', a * 0.35); blend(x, y + 1, 'firefly', a * 0.35);
            }
            if (meteor) {
                const a = night * (1 - meteor.life / 0.85);
                for (let k = 0; k < 8; k++) blend(Math.round(meteor.x - k * 2.3), Math.round(meteor.y - k), 'star', a * (1 - k / 8));
            }
        }
    }

    function render(t: number, dt: number) {
        updatePalette();
        paintWorld(t);
        if (!reduced) stepCritters(t, dt);
        paintPlants(t);
        if (!reduced) paintCritters(t);
        else if (night > 0.5) paintCritters(t);
        ctx!.putImageData(image!, 0, 0);
    }

    // ---------- stitches ----------

    function paintStitch(now: number) {
        sctx!.setTransform(1, 0, 0, 1, 0, 0);
        sctx!.clearRect(0, 0, o.stitch.width, o.stitch.height);
        if (!cells.length) return;
        sctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        const progress = stitchDone ? 1.2 : stitchStart < 0 ? 0 : (now - stitchStart) / 2600;
        if (progress >= 1.2) stitchDone = true;
        const day = [255, 255, 255], nt = [196, 214, 255];
        const col = day.map((v, i) => Math.round(v + (nt[i] - v) * night));
        const alpha = 0.92 - night * 0.2;
        const g = stitchDone && !reduced ? ((now / 1000) % 7) / 2.4 : -1;
        const size = C - 1;
        for (const side of [0, 1]) {
            for (const cell of cells) {
                const age = (progress * 1.08 - cell.t) / 0.04;
                if (age <= 0) continue;
                const s = Math.min(1, age);
                const ease = 1 - (1 - s) * (1 - s);
                const glow = g >= 0 && Math.abs(cell.t - g) < 0.035 ? 1 - Math.abs(cell.t - g) / 0.035 : 0;
                const sz = size * (0.35 + 0.65 * ease) + glow * 0.6;
                const cx = side ? oxR + (ocols - 1 - cell.x) * C + C / 2 : oxL + cell.x * C + C / 2;
                const cy = oy + cell.y * C + C / 2;
                sctx!.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${Math.min(1, alpha + glow * 0.3)})`;
                sctx!.fillRect(cx - sz / 2, cy - sz / 2, sz, sz);
            }
        }
    }

    // ---------- loop and events ----------

    function frame(now: number) {
        raf = 0;
        if (!running) return;
        const dt = Math.min(0.1, (now - last) / 1000);
        if (now - last >= 32) {
            last = now; clock += dt;
            if (night !== nightTarget) night = nightTarget > night ? Math.min(nightTarget, night + dt / 1.1) : Math.max(nightTarget, night - dt / 1.1);
            gust.s *= 0.9;
            render(clock, dt);
            if (stitchStart < 0) stitchStart = now;
            paintStitch(now);
        }
        raf = requestAnimationFrame(frame);
    }
    function start() { if (running || reduced) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
    function still() { render(0, 0); stitchDone = true; paintStitch(performance.now()); }

    function toArt(e: PointerEvent) {
        const r = o.root.getBoundingClientRect();
        return { x: (e.clientX - r.left) / P, y: (e.clientY - r.top) / P };
    }
    function pick(x: number, y: number) {
        for (let i = plants.length - 1; i >= 0; i--) {
            const p = plants[i];
            if (x >= p.left - 0.5 && x <= p.right + 1.5 && y >= p.top - 0.5 && y <= p.base + 1) return p;
        }
        return null;
    }
    function showTip(p: Plant | null) {
        if (p === hovered) return;
        hovered = p;
        if (!p || !p.date) { o.tip.dataset.show = 'false'; if (reduced) still(); return; }
        o.tip.textContent = p.count === 0 ? `No contributions on ${dateLabel(p.date)}` : `${p.count} contribution${p.count === 1 ? '' : 's'} on ${dateLabel(p.date)}`;
        o.tip.dataset.show = 'true';
        const tw = o.tip.offsetWidth;
        const x = clamp(p.x * P + P / 2, tw / 2 + 8, W - tw / 2 - 8);
        o.tip.style.transform = `translate(${Math.round(x - tw / 2)}px, ${Math.round(p.top * P - 10)}px) translateY(-100%)`;
        if (reduced) still();
    }
    let lastX = 0;
    const onMove = (e: PointerEvent) => {
        const a = toArt(e);
        pointer = { x: a.x, y: a.y, inside: true };
        if (!reduced) { const v = a.x - lastX; gust = { x: a.x, s: clamp(gust.s + v * 0.12, -1.6, 1.6) }; }
        lastX = a.x;
        showTip(o.days && a.y > horizon ? pick(a.x, a.y) : null);
    };
    const onLeave = () => { pointer.inside = false; showTip(null); };
    const onDown = (e: PointerEvent) => { if (e.pointerType !== 'mouse') onMove(e); };
    const onScroll = () => { scrollY = window.scrollY; };
    const onTheme = () => { nightTarget = isNight() ? 1 : 0; if (reduced) { night = nightTarget; still(); } };

    let resizeRaf = 0;
    const ro = new ResizeObserver(() => {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => { layout(); if (reduced || !running) still(); });
    });
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !document.hidden) start(); else stop(); }, { threshold: 0 });
    const mo = new MutationObserver(onTheme);
    const onVisibility = () => { if (document.hidden) stop(); else if (o.root.getBoundingClientRect().bottom > 0) start(); };

    layout();
    still();
    stitchDone = reduced;
    ro.observe(o.root); io.observe(o.root);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    o.root.addEventListener('pointermove', onMove);
    o.root.addEventListener('pointerdown', onDown);
    o.root.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
        stop(); ro.disconnect(); io.disconnect(); mo.disconnect(); cancelAnimationFrame(resizeRaf);
        o.root.removeEventListener('pointermove', onMove);
        o.root.removeEventListener('pointerdown', onDown);
        o.root.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('scroll', onScroll);
        document.removeEventListener('visibilitychange', onVisibility);
    };
}
