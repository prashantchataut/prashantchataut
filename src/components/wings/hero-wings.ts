/*
 * Butterflies of the hero meadow. They drift between the blooming plants, settle on them with slow wings,
 * take an interest in the pointer and glow after dark. Everything pauses while the hero is off screen.
 */
import { SPECIES, drawFly, emit, fly, isNight, makeFly, perch, stepDust, type Dust, type Fly } from './wings';

export type Bloom = { x: number; y: number; count: number };

export function startHeroWings(root: HTMLElement, canvas: HTMLCanvasElement) {
    const g = canvas.getContext('2d');
    if (!g) return { setBlooms() {}, stop() {} };
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0, H = 0, raf = 0, last = 0, running = false;
    let blooms: Bloom[] = [];
    let pointer = { x: -999, y: -999, inside: false };
    const dust: Dust[] = [];
    let flock: Fly[] = [];

    const resize = () => {
        const r = root.getBoundingClientRect();
        const dpr = Math.min(devicePixelRatio || 1, 2);
        W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = W < 700 ? 3 : 5;
        if (flock.length !== count) {
            flock = Array.from({ length: count }, (_, i) =>
                makeFly(Math.random() * W, H * (0.25 + Math.random() * 0.3), (W < 700 ? 46 : 64) * (0.85 + (i % 3) * 0.14), i, ((i + 1) * 0.173) % 1),
            );
            flock.forEach((f) => pick(f, 0, true));
        }
    };

    function waypoint(f: Fly) {
        f.tx = W * (0.05 + Math.random() * 0.9);
        f.ty = H * (0.16 + Math.random() * 0.42);
    }
    function pick(f: Fly, t: number, first = false) {
        f.landed = false;
        f.restUntil = 0;
        const roll = Math.random();
        const lively = blooms.filter((b) => b.count >= 3);
        const pool = lively.length > 3 ? lively : blooms;
        if (pointer.inside && roll < 0.22) {
            f.tx = pointer.x + (Math.random() - 0.5) * 90;
            f.ty = pointer.y - 20 - Math.random() * 40;
        } else if (pool.length && roll < (first ? 0.4 : 0.72)) {
            const b = pool[Math.floor(Math.random() * pool.length)];
            f.tx = b.x; f.ty = b.y - 3;
            f.restUntil = -1;
        } else waypoint(f);
        void t;
    }

    const frame = (t: number, dt: number) => {
        g.clearRect(0, 0, W, H);
        const night = isNight();
        for (const f of flock) {
            if (f.landed) {
                perch(f, dt);
                if (t > f.restUntil) { emit(dust, f.x, f.y, f.sp.glow, 1.2); pick(f, t); }
            } else {
                fly(f, f.tx, f.ty, dt, t, 150);
                const d = Math.hypot(f.tx - f.x, f.ty - f.y);
                if (d < 14) {
                    if (f.restUntil === -1) {
                        f.landed = true;
                        f.restUntil = t + 2.5 + Math.random() * 4;
                        for (let i = 0; i < 6; i++) emit(dust, f.x, f.y, f.sp.glow, 0.8);
                    } else pick(f, t);
                } else if (Math.random() < dt * 5) emit(dust, f.x, f.y + 3, f.sp.glow, 0.5, 60);
            }
        }
        stepDust(g, dust, dt);
        for (const f of flock) drawFly(g, f, night);
    };

    const loop = (now: number) => {
        if (!running) return;
        raf = requestAnimationFrame(loop);
        const dt = Math.min((now - (last || now)) / 1000, 0.05);
        last = now;
        frame(now / 1000, dt);
    };
    const start = () => { if (running || reduced) return; running = true; last = 0; raf = requestAnimationFrame(loop); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const still = () => {
        if (!reduced) return;
        flock.forEach((f, i) => {
            const b = blooms[(i * 17 + 5) % Math.max(1, blooms.length)];
            if (b) { f.x = b.x; f.y = b.y - 3; }
            f.flap = 0.85; f.heading = -Math.PI / 2;
        });
        g.clearRect(0, 0, W, H);
        for (const f of flock) drawFly(g, f, isNight());
    };

    const move = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        pointer = { x: e.clientX - r.left, y: e.clientY - r.top, inside: true };
    };
    const leave = () => { pointer.inside = false; };
    const ro = new ResizeObserver(() => { resize(); still(); });
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !document.hidden) start(); else stop(); });
    const vis = () => { if (document.hidden) stop(); else if (root.getBoundingClientRect().bottom > 0) start(); };

    resize();
    ro.observe(root);
    io.observe(root);
    root.addEventListener('pointermove', move, { passive: true });
    root.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', vis);

    return {
        setBlooms(list: Bloom[]) { blooms = list; still(); },
        stop() {
            stop(); ro.disconnect(); io.disconnect();
            root.removeEventListener('pointermove', move);
            root.removeEventListener('pointerleave', leave);
            document.removeEventListener('visibilitychange', vis);
        },
    };
}
