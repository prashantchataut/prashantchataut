import { DAY, type Key } from './palette';
import type { Sprite } from './sprites';

/**
 * Renders a sprite as crisp SVG rectangles, merging runs of the same colour on each row.
 * Used for the legend, the flower beds and small icons, so they match the canvas exactly.
 */
export default function PixelSprite({ sprite, scale = 3, className, mirror = false }: { sprite: Sprite; scale?: number; className?: string; mirror?: boolean }) {
    const width = Math.max(...sprite.map(row => row.length));
    const rects: { x: number; y: number; w: number; c: string }[] = [];
    sprite.forEach((raw, y) => {
        const row = mirror ? raw.split('').reverse().join('').padStart(width, '.') : raw;
        let x = 0;
        while (x < row.length) {
            const ch = row[x];
            if (ch === '.') { x++; continue; }
            let end = x + 1;
            while (end < row.length && row[end] === ch) end++;
            rects.push({ x, y, w: end - x, c: DAY[ch as Key] ?? 'currentColor' });
            x = end;
        }
    });
    return (
        <svg className={className} width={width * scale} height={sprite.length * scale} viewBox={`0 0 ${width} ${sprite.length}`} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
            {rects.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.c} />)}
        </svg>
    );
}
