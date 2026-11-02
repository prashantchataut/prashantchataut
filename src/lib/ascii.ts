/**
 * ASCII artwork generators.
 *
 * Every plate is a composed picture rather than scattered glyphs:
 *  - contours: true isolines of a smooth field — a topographic map
 *  - sky:     a sparse, deliberate starfield
 *  - thaw:    meltwater coming off the range
 *
 * All deterministic, so the same viewport always draws the same plate.
 */

type Grid = string[][];

const blank = (w: number, h: number): Grid =>
    Array.from({ length: h }, () => new Array<string>(w).fill(' '));

export const rows = (g: Grid) => g.map((r) => r.join(''));

/**
 * Repeat the grid end to end. Animating a tiled plate from 0 to -50% loops
 * without a seam; without this the plate jumps every cycle.
 */
export function tileX(g: Grid): Grid {
    return g.map((r) => [...r, ...r]);
}

/** Same, top to bottom. */
export function tileY(g: Grid): Grid {
    return [...g.map((r) => [...r]), ...g.map((r) => [...r])];
}

export function rng(seed: number) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/* ------------------------------------------------------------------ */
/* contours — isolines of a smooth field                               */
/* ------------------------------------------------------------------ */

/**
 * A smooth scalar field over the whole plate. Deliberately has no radial
 * falloff: falloff flattens the field to zero at the edges, which collapses
 * every outer isoline into one solid block.
 */
/**
 * A radial field with a gentle angular wobble.
 *
 * The dominant term is strictly decreasing outward, so the rings stay closed
 * and ordered. The angular term has to stay well under half a level step —
 * any stronger and it reorders adjacent radii, which tears the loops into
 * disconnected fragments.
 */
function relief(x: number, y: number, size: number, seed: number) {
    const c = (size - 1) / 2;
    const dx = (x - c) / c;
    const dy = (y - c) / c;
    const r = Math.hypot(dx, dy);
    const a = Math.atan2(dy, dx);
    const lobes = 0.032 * Math.sin(3 * a + seed) + 0.017 * Math.sin(5 * a - seed * 1.4);
    return -r + lobes * Math.min(1, r * 2.4);
}

export function contours(width: number, height: number, seed: number, levels = 7): Grid {
    const g = blank(width, height);
    const shade = '.:-=+*';
    const span = Math.max(width, height);

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            const f = relief(x, y, span, seed) * levels;
            const nearest = Math.round(f);
            if (Math.abs(f - nearest) > 0.42) continue;
            g[y][x] = shade[((nearest % shade.length) + shade.length) % shade.length];
        }
    }

    return g;
}

/* ------------------------------------------------------------------ */
/* sky — starfield                                                     */
/* ------------------------------------------------------------------ */

/**
 * Sparse marks on a loose grid so they read as placed rather than sprayed.
 * Density is modulated by a smooth field, giving a few dense drifts and wide
 * empty stretches.
 */
export function sky(width: number, height: number, seed: number): Grid {
    const r = rng(seed);
    const g = blank(width, height);
    const marks = ['.', '.', '.', '·', '*', '+'];

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            const drift = 0.5 + 0.5 * Math.sin(x * 0.06 + seed) * Math.cos(y * 0.09 - seed);
            if (r() > drift * 0.3) continue;
            g[y][x] = marks[Math.floor(r() * marks.length)];
        }
    }

    return g;
}

/* ------------------------------------------------------------------ */
/* thaw — meltwater                                                    */
/* ------------------------------------------------------------------ */

export function thaw(width: number, height: number, seed: number): Grid {
    const r = rng(seed);
    const g = blank(width, height);
    const count = Math.max(6, Math.floor(width / 11));

    for (let i = 0; i < count; i += 1) {
        const x = Math.floor(r() * width);
        const start = Math.floor(r() * height * 0.7);
        const len = 3 + Math.floor(r() * 8);
        for (let y = start; y < Math.min(height, start + len); y += 1) {
            if (g[y][x] === ' ') g[y][x] = r() > 0.55 ? '|' : "'";
        }
    }

    return g;
}