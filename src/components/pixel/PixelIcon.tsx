/* Tiny pixel icons drawn in currentColor, so they follow the text they sit beside. */
const ICONS = {
    out: ['.####', '...##', '..#.#', '.#..#', '#....'],
    right: ['..#..', '...#.', '#####', '...#.', '..#..'],
    down: ['..#..', '..#..', '#.#.#', '.###.', '..#..'],
    up: ['..#..', '.###.', '#.#.#', '..#..', '..#..'],
    sun: ['.....#.....', '.....#.....', '..#.....#..', '....###....', '...#####...', '##.#####.##', '...#####...', '....###....', '..#.....#..', '.....#.....', '.....#.....'],
    moon: ['..####.....', '.###.......', '###........', '###......#.', '###.....###', '###......#.', '###........', '.###.......', '..####.....'],
    flower: ['.#.', '#.#', '.#.'],
} as const;

export type IconName = keyof typeof ICONS;

export default function PixelIcon({ name, size = 2, className }: { name: IconName; size?: number; className?: string }) {
    const grid = ICONS[name];
    const w = grid[0].length, h = grid.length;
    const d = grid.flatMap((row, y) => row.split('').map((c, x) => (c === '#' ? `M${x} ${y}h1v1h-1z` : ''))).join('');
    return (
        <svg className={className ? `pixel-icon ${className}` : 'pixel-icon'} width={w * size} height={h * size} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
            <path d={d} fill="currentColor" />
        </svg>
    );
}
