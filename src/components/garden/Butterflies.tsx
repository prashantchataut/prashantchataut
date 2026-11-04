'use client';
import { useEffect, useRef } from 'react';
import { FRAME_MS, SPECIES, clearDirty, drawFly, emit, fly, isNight, makeFly, stepDust, type Dust, type Fly } from '@/components/wings/wings';

/**
 * A small flutter of vivid butterflies that keeps the pointer company on any page.
 * They orbit the cursor, wander when it rests, scatter on click or tap, and shed pixie dust as they fly.
 * Nothing is drawn when the visitor prefers reduced motion.
 */
export function CursorButterflies() {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const c = canvas.current;
        const g = c?.getContext('2d');
        if (!c || !g || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const coarse = matchMedia('(pointer: coarse)').matches;
        const count = coarse ? 3 : 4;
        const size = coarse ? 40 : 52;
        const flock: Fly[] = Array.from({ length: count }, (_, i) =>
            makeFly(-200, -200, size * (0.8 + ((i * 37) % 10) / 22), (i * 2 + 1) % SPECIES.length, ((i + 1) * 0.211) % 1),
        );
        const dust: Dust[] = [];
        let W = 0, H = 0, raf = 0, last = 0, painted = 0;
        let px = -200, py = -200, lastMove = 0, started = false;
        let alpha = 0, target = 0;

        const resize = () => {
            const dpr = Math.min(devicePixelRatio || 1, 1.5);
            W = innerWidth; H = innerHeight;
            c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
            c.style.width = W + 'px'; c.style.height = H + 'px';
            g.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const scatter = (power: number) => {
            flock.forEach((f, i) => {
                const a = f.ang + i * 1.7;
                f.vx += Math.cos(a) * power;
                f.vy += Math.sin(a) * power - power * 0.25;
                for (let k = 0; k < 5; k++) emit(dust, f.x, f.y, f.sp.glow, 1.6);
            });
        };

        const move = (e: PointerEvent) => {
            px = e.clientX; py = e.clientY; lastMove = performance.now(); target = 1;
            if (!started) {
                started = true;
                flock.forEach((f) => { f.x = px; f.y = py; });
                scatter(360);
            }
        };
        const down = () => { if (started) scatter(520); };
        const leave = () => { if (!coarse) target = 0; };

        const tick = (now: number) => {
            raf = requestAnimationFrame(tick);
            if (document.hidden) { last = now; return; }
            if (now - painted < FRAME_MS) return;
            painted = now;
            const dt = Math.min((now - (last || now)) / 1000, 0.05);
            last = now;
            const t = now / 1000;
            alpha += (target - alpha) * Math.min(1, dt * 4);
            if (coarse && target && now - lastMove > 5000) target = 0;
            if (alpha < 0.01 && dust.length === 0) { if (alpha !== 0) { clearDirty(g); alpha = 0; } return; }

            clearDirty(g);
            const resting = now - lastMove > 2500;
            const night = isNight();
            for (const f of flock) {
                f.ang += f.spin * dt * (resting ? 0.5 : 1.3);
                const r = f.radius * (resting ? 1.7 : 1);
                const tx = px + Math.cos(f.ang) * r;
                const ty = py + Math.sin(f.ang * 1.3) * r * 0.62 - 12;
                const gap = Math.hypot(tx - f.x, ty - f.y);
                fly(f, tx, ty, dt, t, 240 + gap * 1.5);
                const speed = Math.hypot(f.vx, f.vy);
                if (speed > 40 && Math.random() < dt * (speed / 70)) emit(dust, f.x, f.y + 4, f.sp.glow, 0.6);
            }
            stepDust(g, dust, dt);
            for (const f of flock) drawFly(g, f, night, alpha);
        };

        resize();
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
