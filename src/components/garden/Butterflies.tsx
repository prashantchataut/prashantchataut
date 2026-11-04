'use client';
import { useEffect, useRef } from 'react';
import {
    FRAME_MS, clearDirty, drawFly, emit, fly, isNight, makeFly, perch, shuffleSpecies, stepDust,
    type Dust, type Fly,
} from '@/components/wings/wings';

/**
 * A loose flutter of quiet butterflies that keeps the pointer company on any page.
 *
 * Most of them ride along with the cursor; the rest peel away and settle near the edges of the page.
 * A resting one wakes when the cursor passes close, or when a flying companion drifts by and it notices.
 * Count, size, colour, orbit and flight times are drawn fresh on every load.
 * Nothing is drawn when the visitor prefers reduced motion.
 */

type Companion = {
    fly: Fly;
    /** resting place, kept as a fraction of the viewport so it survives a resize */
    home: { x: number; y: number };
    settled: boolean;
    /** when the current flight loses interest */
    until: number;
    /** how long after the cursor stops this one keeps circling */
    linger: number;
    /** cooldown before a passing companion can wake it again */
    patience: number;
};

export function CursorButterflies() {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const c = canvas.current;
        const g = c?.getContext('2d');
        if (!c || !g || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const coarse = matchMedia('(pointer: coarse)').matches;
        const count = coarse ? 2 + Math.floor(Math.random() * 2) : 3 + Math.floor(Math.random() * 3);
        const base = coarse ? 33 : 41;
        const narrow = innerWidth < 760;
        const palette = shuffleSpecies();

        const flock: Companion[] = Array.from({ length: count }, (_, i) => {
            // Wide screens have real margins to rest in; narrow ones keep to the top and bottom bands.
            // Each one gets its own vertical slot so two never settle on the same leaf.
            const slot = 0.1 + ((i + 0.5 + (Math.random() - 0.5) * 0.6) / count) * 0.8;
            const home = narrow
                ? { x: 0.08 + Math.random() * 0.84, y: i % 2 === 0 ? 0.12 + Math.random() * 0.08 : 0.84 + Math.random() * 0.1 }
                : { x: i % 2 === 0 ? 0.02 + Math.random() * 0.05 : 0.93 + Math.random() * 0.05, y: slot };
            const f = makeFly(0, 0, base * (0.84 + Math.random() * 0.32), i, Math.random(), palette[i % palette.length]);
            f.radius = 24 + Math.random() * 38;
            f.spin = (Math.random() < 0.5 ? -1 : 1) * (0.45 + Math.random() * 0.75);
            return { fly: f, home, settled: true, until: 0, linger: Math.random() * 2200, patience: 0 };
        });
        const dust: Dust[] = [];
        let W = 0, H = 0, raf = 0, last = 0, painted = 0;
        let px = -200, py = -200, lastMove = 0, started = false;

        const resize = () => {
            const dpr = Math.min(devicePixelRatio || 1, 1.5);
            W = innerWidth; H = innerHeight;
            c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
            c.style.width = W + 'px'; c.style.height = H + 'px';
            g.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const wake = (b: Companion, now: number) => {
            b.settled = false;
            b.until = now + 3600 + Math.random() * 5200;
            b.linger = Math.random() * 2200;
            const f = b.fly;
            f.ang = Math.atan2(f.y - py, f.x - px) + (Math.random() - 0.5) * 0.9;
            f.radius = 22 + Math.random() * 34;
            f.spin = (Math.random() < 0.5 ? -1 : 1) * (0.4 + Math.random() * 0.75);
            for (let k = 0; k < 3; k++) emit(dust, f.x, f.y, f.sp.glow, 0.7);
        };

        const settle = (b: Companion, now: number) => {
            if (b.settled) return;
            b.settled = true;
            b.patience = now + 4500 + Math.random() * 5500;
        };

        const scatter = (power: number) => {
            flock.forEach((b, i) => {
                if (b.settled) return;
                const a = b.fly.ang + i * 1.7;
                b.fly.vx += Math.cos(a) * power;
                b.fly.vy += Math.sin(a) * power - power * 0.25;
                for (let k = 0; k < 5; k++) emit(dust, b.fly.x, b.fly.y, b.fly.sp.glow, 1.4);
            });
        };

        const move = (e: PointerEvent) => {
            px = e.clientX; py = e.clientY; lastMove = performance.now();
            if (started) return;
            started = true;
            // One first hello: most of the flutter lifts off to meet the cursor, the rest stay put.
            const greeting = Math.max(1, Math.ceil(flock.length * 0.6));
            const order = flock.map((_, i) => i);
            for (let i = order.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [order[i], order[j]] = [order[j], order[i]];
            }
            order.slice(0, greeting).forEach((i) => {
                const b = flock[i];
                b.fly.x = px + (Math.random() - 0.5) * 48;
                b.fly.y = py + (Math.random() - 0.5) * 36;
                wake(b, lastMove);
            });
        };
        const down = () => { if (started) scatter(480); };
        const leave = () => {
            const now = performance.now();
            flock.forEach((b) => settle(b, now));
        };

        const tick = (now: number) => {
            raf = requestAnimationFrame(tick);
            if (document.hidden) { last = now; return; }
            if (now - painted < FRAME_MS) return;
            painted = now;
            const dt = Math.min((now - (last || now)) / 1000, 0.05);
            last = now;
            const t = now / 1000;
            const night = isNight();
            const idle = started ? now - lastMove : Infinity;

            clearDirty(g);
            for (const b of flock) {
                const f = b.fly;
                const hx = b.home.x * W, hy = b.home.y * H;

                if (b.settled) {
                    const toHome = Math.hypot(hx - f.x, hy - f.y);
                    if (toHome > 6) {
                        fly(f, hx, hy, dt, t, 170 + Math.min(toHome, 400) * 0.25);
                    } else {
                        f.x = hx; f.y = hy;
                        perch(f, dt);
                    }
                    const nearCursor = started && idle < 1200 && Math.hypot(px - f.x, py - f.y) < 270;
                    const nearFriend = now > b.patience && flock.some(
                        (o) => o !== b && !o.settled && Math.hypot(o.fly.x - f.x, o.fly.y - f.y) < 105,
                    );
                    if (nearCursor || nearFriend) wake(b, now);
                } else {
                    f.ang += f.spin * dt * (0.9 + f.seed * 0.9);
                    const r = f.radius * (0.92 + 0.16 * Math.sin(t * 0.6 + f.seed * 7));
                    const tx = px + Math.cos(f.ang) * r;
                    const ty = py + Math.sin(f.ang * 1.3) * r * 0.6 - 10;
                    const gap = Math.hypot(tx - f.x, ty - f.y);
                    fly(f, tx, ty, dt, t, (200 + gap * 1.35) * (0.86 + f.seed * 0.3));
                    const speed = Math.hypot(f.vx, f.vy);
                    if (speed > 40 && Math.random() < dt * (speed / 90)) emit(dust, f.x, f.y + 3, f.sp.glow, 0.45);
                    const away = Math.hypot(px - f.x, py - f.y);
                    if ((idle > 2400 + b.linger && away > 40) || (now > b.until && away > 330)) settle(b, now);
                }
            }
            stepDust(g, dust, dt);
            for (const b of flock) drawFly(g, b.fly, night);
        };

        resize();
        flock.forEach((b) => { b.fly.x = b.home.x * W; b.fly.y = b.home.y * H; });
        addEventListener('resize', resize);
        addEventListener('pointermove', move, { passive: true });
        addEventListener('pointerdown', down, { passive: true });
        document.documentElement.addEventListener('pointerleave', leave);
        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            removeEventListener('resize', resize);
            removeEventListener('pointermove', move);
            removeEventListener('pointerdown', down);
            document.documentElement.removeEventListener('pointerleave', leave);
        };
    }, []);

    return <canvas ref={canvas} className="cursor-wings" aria-hidden="true" />;
}
