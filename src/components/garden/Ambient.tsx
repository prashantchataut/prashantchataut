'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion, startGarden, useGarden } from './store';

const ARROW = ['#........', '##.......', '#o#......', '#oo#.....', '#ooo#....', '#oooo#...', '#ooooo#..', '#oooooo#.', '#ooooooo#', '#oooo#####', '#oo#oo#...', '#o#.#oo#..', '##..#oo#..', '#....#oo#.', '.....####.'];
function cursor(fill: string) {
  const cell = 2;
  const rects = ARROW.flatMap((r, y) => r.split('').map((ch, x) => ch === '.' ? '' : `<rect x='${x * cell}' y='${y * cell}' width='${cell}' height='${cell}' fill='${ch === '#' ? '#1b2559' : fill}'/>`)).join('');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${9 * cell}' height='${ARROW.length * cell}' shape-rendering='crispEdges'>${rects}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 1 1, auto`;
}

interface P { x: number; y: number; vx: number; vy: number; life: number; c: string; }

/* Page-wide sparkle: a petal trail behind a fine pointer, a few drifting petals by day
   and fireflies by night. Skipped completely when motion is reduced. */
export default function Ambient() {
  const ref = useRef<HTMLCanvasElement>(null);
  const g = useGarden();
  const night = useRef(false);
  night.current = g.theme === 'dark';

  useEffect(() => {
    startGarden();
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const root = document.documentElement.style;
      root.setProperty('--cur-arrow', cursor('#fffdf3'));
      root.setProperty('--cur-hand', cursor('#ffd23f'));
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    const PX = 3;
    let W = 0, H = 0;
    const size = () => { W = Math.ceil(window.innerWidth / PX); H = Math.ceil(window.innerHeight / PX); c.width = W; c.height = H; };
    size();
    window.addEventListener('resize', size);
    const trail: P[] = [];
    const amb = Array.from({ length: 10 }, (_, i) => ({ x: Math.random() * W, y: Math.random() * H, ph: Math.random() * 6.28, sp: 0.5 + Math.random(), i }));
    let lx = -99, ly = -99;
    const cols = ['#ff9cc7', '#ffd23f', '#ffffff', '#9ab8ff', '#ffb3cf'];
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const d = Math.hypot(e.clientX - lx, e.clientY - ly);
      if (d < 16) return;
      lx = e.clientX; ly = e.clientY;
      for (let k = 0; k < 2; k++) trail.push({ x: e.clientX / PX, y: e.clientY / PX, vx: (Math.random() - 0.5) * 14, vy: -4 - Math.random() * 6, life: 0.7 + Math.random() * 0.5, c: cols[Math.floor(Math.random() * cols.length)] });
      if (trail.length > 70) trail.splice(0, trail.length - 70);
    };
    window.addEventListener('pointermove', move, { passive: true });
    let raf = 0, last = performance.now();
    const loop = (ms: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || ms - last < 32) return;
      const dt = Math.min(0.1, (ms - last) / 1000);
      last = ms;
      const t = ms / 1000;
      ctx.clearRect(0, 0, W, H);
      const isNight = night.current;
      for (const a of amb) {
        if (isNight) {
          const al = Math.max(0, Math.sin(t * a.sp + a.ph)) ** 3;
          a.x += Math.sin(t * 0.4 + a.ph) * 4 * dt; a.y += Math.cos(t * 0.3 + a.ph) * 3 * dt;
          if (al < 0.1) continue;
          ctx.globalAlpha = al * 0.3; ctx.fillStyle = '#e8ff7a'; ctx.fillRect(Math.round(a.x) - 1, Math.round(a.y) - 1, 3, 3);
          ctx.globalAlpha = al; ctx.fillStyle = '#fbffc4'; ctx.fillRect(Math.round(a.x), Math.round(a.y), 1, 1);
        } else {
          a.y += (4 + a.sp * 3) * dt; a.x += (4 + Math.sin(t * 0.7 + a.ph) * 5) * dt;
          ctx.globalAlpha = 0.85; ctx.fillStyle = a.i % 2 ? '#ffb3cf' : '#ffffff';
          ctx.fillRect(Math.round(a.x), Math.round(a.y), Math.sin(t * 3 + a.ph) > 0 ? 2 : 1, 1);
        }
        if (a.y > H + 2 || a.x > W + 2 || a.y < -4 || a.x < -4) { a.x = Math.random() * W * 0.8; a.y = -2; }
      }
      ctx.globalAlpha = 1;
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.life -= dt;
        if (p.life <= 0) { trail.splice(i, 1); continue; }
        p.vy += 18 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        ctx.globalAlpha = Math.min(1, p.life * 2);
        ctx.fillStyle = p.c;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', size); window.removeEventListener('pointermove', move); };
  }, []);

  return <canvas ref={ref} className="gd-ambient" aria-hidden="true" />;
}
