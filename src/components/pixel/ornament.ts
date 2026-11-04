/*
 * Builds the stitched flourishes that frame the hero, cell by cell, in the order a needle would make them.
 * Coordinates are in cells: x = 0 is the outer edge, x grows toward the centre of the page.
 * Each cell carries a time t in [0, 1]; the canvas reveals cells as the stitching progresses.
 */
export type Cell = { x: number; y: number; t: number };

type Pt = [number, number];

class Stitcher {
    cells = new Map<string, Cell>();
    constructor(private cols: number, private rows: number) {}
    put(x: number, y: number, t: number) {
        const cx = Math.round(x), cy = Math.round(y);
        if (cx < 0 || cy < 0 || cx >= this.cols || cy >= this.rows) return;
        const key = cx + ',' + cy;
        const prev = this.cells.get(key);
        if (!prev || prev.t > t) this.cells.set(key, { x: cx, y: cy, t });
    }
    /** Samples a parametric curve finely so the line has no gaps. */
    curve(fn: (u: number) => Pt, t0: number, t1: number, steps = 220) {
        for (let i = 0; i <= steps; i++) {
            const u = i / steps;
            const [x, y] = fn(u);
            this.put(x, y, t0 + (t1 - t0) * u);
        }
    }
    spiral(from: Pt, centre: Pt, turns: number, spin: 1 | -1, t0: number, t1: number, shrink = 0.86) {
        const r0 = Math.hypot(from[0] - centre[0], from[1] - centre[1]);
        const a0 = Math.atan2(from[1] - centre[1], from[0] - centre[0]);
        this.curve(u => {
            const a = a0 + spin * u * turns * Math.PI * 2;
            const r = r0 * (1 - shrink * u);
            return [centre[0] + Math.cos(a) * r, centre[1] + Math.sin(a) * r];
        }, t0, t1, Math.ceil(r0 * turns * 14) + 30);
    }
    ring(c: Pt, r: number, t0: number, t1: number) {
        this.curve(u => [c[0] + Math.cos(u * Math.PI * 2) * r, c[1] + Math.sin(u * Math.PI * 2) * r], t0, t1, 80);
    }
    sparkle(c: Pt, arm: number, t: number) {
        this.put(c[0], c[1], t);
        for (let i = 1; i <= arm; i++) {
            const tt = t + i * 0.004;
            this.put(c[0] + i, c[1], tt); this.put(c[0] - i, c[1], tt);
            this.put(c[0], c[1] + i, tt); this.put(c[0], c[1] - i, tt);
        }
    }
    flower(c: Pt, t: number) {
        // five little petals around an open centre, like the lace flowers in a sampler border
        for (let i = 0; i < 5; i++) {
            const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
            this.ring([c[0] + Math.cos(a) * 2.2, c[1] + Math.sin(a) * 2.2], 1.05, t + i * 0.008, t + i * 0.008 + 0.01);
        }
    }
    leaf(base: Pt, tip: Pt, t0: number, t1: number) {
        const mx = (base[0] + tip[0]) / 2, my = (base[1] + tip[1]) / 2;
        const nx = -(tip[1] - base[1]) * 0.45, ny = (tip[0] - base[0]) * 0.45;
        const bez = (p: Pt, q: Pt, r: Pt) => (u: number): Pt => [
            (1 - u) * (1 - u) * p[0] + 2 * (1 - u) * u * q[0] + u * u * r[0],
            (1 - u) * (1 - u) * p[1] + 2 * (1 - u) * u * q[1] + u * u * r[1],
        ];
        this.curve(bez(base, [mx + nx, my + ny], tip), t0, t1, 40);
        this.curve(bez(base, [mx - nx, my - ny], tip), t0, t1, 40);
    }
    list() {
        return Array.from(this.cells.values()).sort((a, b) => a.t - b.t);
    }
}

export function buildOrnament(cols: number, rows: number, compact = false): Cell[] {
    const s = new Stitcher(cols, rows);
    const stemX = (u: number) => 6 + Math.sin(u * Math.PI * 1.6 + 0.3) * 2.6;
    const top = 13;
    const bottom = rows - 8;
    const stemY = (u: number) => top + u * (bottom - top);
    const at = (u: number): Pt => [stemX(u), stemY(u)];

    // a bow to start, then the vine grows down from its knot
    const bow: Pt = [7, 7];
    s.curve(u => [bow[0] - 3.4 - Math.cos(u * Math.PI * 2) * 3.4, bow[1] - Math.sin(u * Math.PI * 2) * 2.3], 0, 0.07, 90);
    s.curve(u => [bow[0] + 3.4 + Math.cos(u * Math.PI * 2) * 3.4, bow[1] - Math.sin(u * Math.PI * 2) * 2.3], 0.02, 0.09, 90);
    s.ring(bow, 0.9, 0.06, 0.08);
    s.curve(u => [bow[0] - u * 3.6, bow[1] + 1 + u * 4 + Math.sin(u * 3) * 0.6], 0.08, 0.12, 30);
    s.curve(u => [bow[0] + u * 3.6, bow[1] + 1 + u * 4 + Math.sin(u * 3) * 0.6], 0.08, 0.12, 30);
    s.curve(u => [bow[0] + Math.sin(u * 2.2) * 0.8, bow[1] + 1 + u * (top - bow[1])], 0.1, 0.14, 30);

    const T0 = 0.14, T1 = 0.86;
    s.curve(at, T0, T1, rows * 6);
    const tAt = (u: number) => T0 + (T1 - T0) * u;

    // scrolls: large ones reach toward the name, small ones tuck toward the edge
    const scrolls = compact ? [0.2, 0.55, 0.85] : [0.12, 0.27, 0.42, 0.58, 0.74, 0.9];
    scrolls.forEach((u, i) => {
        const j = at(u);
        const inward = i % 2 === 0;
        const big = inward ? Math.min(cols - j[0] - 4, compact ? 6 : 8.5) : 3.2;
        const dir = inward ? 1 : -1;
        const centre: Pt = [j[0] + dir * big * 0.95, j[1] - big * 0.55];
        const spin: 1 | -1 = inward ? -1 : 1;
        const t = tAt(u);
        s.spiral(j, centre, inward ? 1.7 : 1.35, spin, t, t + 0.12);
        if (inward && !compact) s.leaf(j, [j[0] + dir * 3.5, j[1] + 3.2], t, t + 0.04);
        if (inward && i % 4 === 0) s.sparkle([Math.min(cols - 3, centre[0] + big + 2), centre[1] - big + 0.5], 2, t + 0.12);
    });

    // leaves on the outside of the vine
    const leaves = compact ? [0.38, 0.7] : [0.06, 0.2, 0.35, 0.5, 0.66, 0.82];
    leaves.forEach(u => {
        const j = at(u);
        s.leaf(j, [Math.max(0.5, j[0] - 3.6), j[1] - 2.6], tAt(u), tAt(u) + 0.03);
    });

    // two lace flowers and a few sparkles in open space
    if (!compact) {
        const f1 = at(0.34);
        s.flower([Math.min(cols - 4, f1[0] + 12), f1[1] + 7], tAt(0.36));
        const f2 = at(0.66);
        s.flower([Math.min(cols - 4, f2[0] + 11), f2[1] + 7], tAt(0.68));
        s.sparkle([Math.min(cols - 3, 20), Math.round(stemY(0.05))], 1, tAt(0.08));
        s.sparkle([Math.min(cols - 3, 24), Math.round(stemY(0.5))], 1, tAt(0.52));
    }

    // the vine ends in a wide curl, as if resting on the hill
    const end = at(1);
    s.spiral(end, [end[0] + 5, end[1] - 2.2], 1.25, -1, T1, 1);
    s.sparkle([end[0] + 12, end[1] - 4], 1, 0.98);

    return s.list();
}
