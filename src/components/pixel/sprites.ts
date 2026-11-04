/* Pixel sprites, drawn bottom-up from the ground. '.' is empty; every other letter is a palette key. */
export type Sprite = readonly string[];

export const PLANTS: Record<string, readonly Sprite[]> = {
    // no contributions: a tuft of grass
    grass: [
        ['.g..', '.g.g', 'gG.g'],
        ['g..g', '.gg.', '.Gg.'],
        ['..g.', 'g.g.', 'gGgg'],
    ],
    // 1 to 2: a sprout with a closed bud
    sprout: [
        ['.k.', 'lsl', '.s.', '.s.'],
        ['.k.', '.sl', 'ls.', '.s.'],
    ],
    // 3 to 5: a daisy
    daisy: [
        ['.w.', 'wyw', '.w.', '.s.', 'ls.', '.sl', '.s.'],
        ['.w.', 'wyw', '.W.', '.s.', '.sl', 'ls.', '.s.'],
    ],
    // 6 to 11: forget-me-nots
    forget: [
        ['.b...', 'byb.c', '.b.cy', '.s..c', '.sls.', 'ls.s.', '..s..'],
        ['...b.', 'c.byb', 'yc.b.', 'c..s.', '.sls.', '.s.sl', '..s..'],
    ],
    // 12 to 24: cosmos
    cosmos: [
        ['.p.p.', 'pPyPp', '.pPp.', '..s..', '.ls..', '..s..', '..sl.', '..s..', '..s..'],
        ['.p.p.', 'pPyPp', '.pPp.', '..s..', '..sl.', '..s..', '.ls..', '..s..', '..s..'],
    ],
    // 25 and up: rhododendron, the national flower of Nepal
    rhodo: [
        ['..r.r..', '.rorRr.', 'rRrrorR', '.rRrRr.', 'LlrsrlL', '.Ll.lL.', '..lsl..', '...s...', '...s...'],
        ['.r.r...', 'rorRr.r', 'rRrrorR', '.rRrRr.', 'Llrs.lL', '.LlslL.', '..ls...', '...s...', '...s...'],
    ],
};

export type PlantKind = keyof typeof PLANTS;

export function kindFor(count: number): PlantKind {
    if (count <= 0) return 'grass';
    if (count <= 2) return 'sprout';
    if (count <= 5) return 'daisy';
    if (count <= 11) return 'forget';
    if (count <= 24) return 'cosmos';
    return 'rhodo';
}

export const LEGEND: { kind: PlantKind; label: string }[] = [
    { kind: 'grass', label: '0' },
    { kind: 'sprout', label: '1–2' },
    { kind: 'daisy', label: '3–5' },
    { kind: 'forget', label: '6–11' },
    { kind: 'cosmos', label: '12–24' },
    { kind: 'rhodo', label: '25+' },
];

export const BUTTERFLY: readonly Sprite[] = [
    ['ww.ww', 'wwbww', '.wbw.'],
    ['.w.w.', '.wbw.', '..b..'],
    ['..b..', '.wbw.', '..b..'],
];

// Small flowers for the beds under each project, keyed by project.
export const BEDS: Record<string, readonly Sprite[]> = {
    forget: PLANTS.forget,
    dandelion: [
        ['.d.d.', 'd.d.d', '.ddd.', 'd.d.d', '.dsd.', '..s..', '.ls..', '..s..', '..s..'],
        ['.u.', 'uUu', '.u.', '.s.', 'ls.', '.sl', '.s.'],
    ],
    sunflower: [
        ['.uuu.', 'uUyUu', 'uyUyu', 'uUyUu', '.uuu.', '..s..', 'lls..', '..sll', '..s..', '..s..'],
        ['.u.', 'uUu', '.u.', '.s.', 'lsl', '.s.', '.s.'],
    ],
    rose: [
        ['.rr.', 'rRor', 'rRRr', '.rr.', 'Ls..', '.sL.', '.s..', '.s..'],
        ['.pp.', 'pPPp', '.pp.', 'ls..', '.sl.', '.s..'],
    ],
};
