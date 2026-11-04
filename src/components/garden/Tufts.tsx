'use client';

import { useEffect, useRef } from 'react';
import { useGarden } from './store';

const h = (x: number, s = 0) => {
  let n = Math.imul(x + s * 977, 374761393);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
};

/* A strip of grass blades in the colour of the section below, with a few
   wildflowers poking up. It is what the hero's hill dissolves into. */
export default function Tufts({ variant = 'grass' }: { variant?: 'grass' | 'cloud' }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { theme } = useGarden();

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const draw = () => {
      const px = 3;
      const W = Math.ceil(c.clientWidth / px) || 200;
      const H = 22;
      c.width = W; c.height = H;
      const ctx = c.getContext('2d')!;
      const paper = getComputedStyle(document.documentElement).getPropertyValue('--gd-paper').trim() || '#fdf7e8';
      const base = 6;
      ctx.clearRect(0, 0, W, H);
      if (variant === 'cloud') {
        const shade = getComputedStyle(document.documentElement).getPropertyValue('--gd-paper-2').trim() || '#f3ead2';
        for (let x = 0; x < W; x++) {
          const d = 4 + Math.round(4 * Math.abs(Math.sin(x * 0.085)) + 3 * Math.abs(Math.sin(x * 0.19 + 1)) + 2 * Math.abs(Math.sin(x * 0.037 + 2)));
          ctx.fillStyle = shade;
          ctx.fillRect(x, 0, 1, d + 1);
          ctx.fillStyle = paper;
          ctx.fillRect(x, 0, 1, d - 1);
        }
        return;
      }
      ctx.fillStyle = paper;
      ctx.fillRect(0, H - base, W, base);
      for (let x = 0; x < W; x++) {
        const r = h(x);
        if (r < 0.55) {
          const bh = 1 + Math.floor(h(x, 2) * 6);
          ctx.fillStyle = paper;
          ctx.fillRect(x, H - base - bh, 1, bh);
          if (bh > 3 && h(x, 3) < 0.4) ctx.fillRect(x + (h(x, 4) < 0.5 ? -1 : 1), H - base - bh + 1, 1, 2);
        }
      }
      const heads = ['#ff9cc7', '#ffd23f', '#ffffff', '#7ba6ff', '#ff8a3d'];
      const n = Math.max(3, Math.floor(W / 34));
      for (let i = 0; i < n; i++) {
        const x = Math.floor(((i + 0.3 + h(i, 8) * 0.5) / n) * W);
        const sh = 6 + Math.floor(h(i, 9) * 6);
        ctx.fillStyle = '#3a9a35';
        ctx.fillRect(x, H - base - sh, 1, sh);
        ctx.fillStyle = '#78d05a';
        ctx.fillRect(x + 1, H - base - 3, 2, 1);
        const col = heads[Math.floor(h(i, 10) * heads.length)];
        const y = H - base - sh - 1;
        ctx.fillStyle = col;
        ctx.fillRect(x - 1, y, 3, 1);
        ctx.fillRect(x, y - 1, 1, 3);
        ctx.fillStyle = '#ffe27a';
        ctx.fillRect(x, y, 1, 1);
      }
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    return () => ro.disconnect();
  }, [theme, variant]);

  return <canvas ref={ref} className={'gd-tufts is-' + variant} aria-hidden="true" />;
}
