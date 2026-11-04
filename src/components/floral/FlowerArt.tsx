/* Five flower shapes drawn from ellipses. Colours come from CSS tokens (.fl-0 to .fl-4), so both themes stay in sync. */
const SHAPES = [
    { n: 5, rx: 0.4, ry: 0.52, off: 0.56, inner: 0.58 },
    { n: 8, rx: 0.24, ry: 0.5, off: 0.6, inner: 0.6 },
    { n: 5, rx: 0.44, ry: 0.5, off: 0.55, inner: 0.55 },
    { n: 6, rx: 0.28, ry: 0.62, off: 0.66, inner: 0.55 },
    { n: 10, rx: 0.16, ry: 0.5, off: 0.62, inner: 0.6 },
] as const;

export const FLOWER_COLORS = ['var(--c-coral)', 'var(--c-sun)', 'var(--c-rose)', 'var(--c-iris)', 'var(--c-cream)'] as const;

export default function FlowerArt({ kind, r }: { kind: number; r: number }) {
    const s = SHAPES[kind % SHAPES.length];
    const petals = Array.from({ length: s.n }, (_, i) => i);
    return (
        <g className={`fl fl-${kind % SHAPES.length}`}>
            {petals.map((i) => (
                <ellipse key={`a${i}`} className="pa" cx={0} cy={-s.off * r} rx={s.rx * r} ry={s.ry * r} transform={`rotate(${(i * 360) / s.n})`} />
            ))}
            {petals.map((i) => (
                <ellipse
                    key={`b${i}`}
                    className="pb"
                    cx={0}
                    cy={-s.off * r * s.inner}
                    rx={s.rx * r * s.inner}
                    ry={s.ry * r * s.inner}
                    transform={`rotate(${(i * 360) / s.n + 180 / s.n})`}
                />
            ))}
            <circle className="pc" r={r * 0.2} />
            <circle className="pd" r={r * 0.08} cx={r * 0.05} cy={-r * 0.05} />
        </g>
    );
}
