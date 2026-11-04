'use client';

import { useEffect, useRef } from 'react';
import { SPECIES, paintHead } from './scene';
import { onTick, prefersReducedMotion } from './store';

/* Pixel icons are drawn as crisp SVG rects, so they scale without blurring. */
function Px({ rows, map, size = 2, label }: { rows: string[]; map: Record<string, string>; size?: number; label?: string }) {
  const w = rows[0].length;
  const rects: React.ReactNode[] = [];
  rows.forEach((r, y) => r.split('').forEach((ch, x) => { if (map[ch]) rects.push(<rect key={x + '-' + y} x={x} y={y} width="1" height="1" fill={map[ch]} />); }));
  return (
    <svg viewBox={`0 0 ${w} ${rows.length}`} width={w * size} height={rows.length * size} shapeRendering="crispEdges" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false">
      {rects}
    </svg>
  );
}

export const Arrow = ({ dir = 'ne' }: { dir?: 'ne' | 'down' | 'right' }) => {
  const rows = {
    ne: ['..####', '...###', '..#.##', '.#..##', '#....#', '......'],
    down: ['..#..', '..#..', '#####', '.###.', '..#..'],
    right: ['..#..', '...#.', '#####', '...#.', '..#..'],
  }[dir];
  return <Px rows={rows} map={{ '#': 'currentColor' }} size={2} />;
};

export const SunIcon = () => (
  <Px
    size={2}
    rows={['....#....', '.#.....#.', '..#####..', '..#####..', '#.#####.#', '..#####..', '..#####..', '.#.....#.', '....#....']}
    map={{ '#': 'currentColor' }}
  />
);
export const MoonIcon = () => (
  <Px
    size={2}
    rows={['...####..', '..###....', '.###.....', '.###.....', '.###.....', '.###....#', '..###..##', '...#####.', '.....###.']}
    map={{ '#': 'currentColor' }}
  />
);

/* A small swaying flower sprite on its own canvas. */
export function PixelFlower({ kind, h = 14, scale = 3, className, sway = true }: { kind: keyof typeof SPECIES; h?: number; scale?: number; className?: string; sway?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const sp = SPECIES[kind];
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    const W = 17, H = h + 12;
    c.width = W; c.height = H;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const s = sway ? Math.sin(t * 1.4) * 1.2 : 0;
      const top = Math.round(8 + s);
      ctx.fillStyle = '#2c7a2a';
      for (let i = 0; i < h; i++) { const fr = i / h; ctx.fillRect(8 + Math.round(s * fr * fr), H - 1 - i, 1, 1); }
      ctx.fillStyle = '#4cae3c';
      ctx.fillRect(8, H - 1, 1, 1);
      ctx.fillStyle = '#3a9a35';
      const ly = H - 1 - Math.floor(h * 0.35);
      ctx.fillRect(9, ly, 1, 1); ctx.fillRect(10, ly - 1, 1, 1); ctx.fillRect(11, ly - 1, 1, 1);
      ctx.fillRect(7, ly - 3, 1, 1); ctx.fillRect(6, ly - 4, 1, 1); ctx.fillRect(5, ly - 4, 1, 1);
      paintHead(ctx, sp, top, H - 1 - h - 1, 0, t);
    };
    draw(0);
    if (!sway || prefersReducedMotion()) return;
    return onTick(draw);
  }, [h, sp, sway]);
  return <canvas ref={ref} className={'gd-pxflower ' + (className ?? '')} style={{ width: 17 * scale, height: (h + 12) * scale }} aria-hidden="true" />;
}
