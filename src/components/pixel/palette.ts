/* Colours of the pixel world, day and night. Every value the canvases paint comes from here. */
export const KEYS = [
    'sky0', 'sky1', 'sky2', 'sky3',
    'cloudLight', 'cloudMid', 'cloudShade', 'farLight', 'farShade',
    'hillFarLight', 'hillFar', 'hillMidLight', 'hillMid', 'hillNearLight', 'hillNear', 'hillNearDark', 'speck',
    'g', 'G', 's', 'l', 'L', 'w', 'W', 'y', 'k', 'b', 'B', 'c', 'p', 'P', 'r', 'R', 'o', 'd', 'u', 'U',
    'star', 'firefly', 'wing', 'wing2', 'body', 'petal', 'petal2', 'paper', 'outline',
] as const;
export type Key = (typeof KEYS)[number];
export type Palette = Record<Key, string>;

export const DAY: Palette = {
    sky0: '#8ec3ec', sky1: '#a3cff1', sky2: '#bddef5', sky3: '#d7ecf8',
    cloudLight: '#ffffff', cloudMid: '#e3effa', cloudShade: '#b6d1ef', farLight: '#d3e7f7', farShade: '#bfdaf2',
    hillFarLight: '#b9d9a0', hillFar: '#a1c98a', hillMidLight: '#9bcd6c', hillMid: '#7db552', hillNearLight: '#86c256', hillNear: '#66a642', hillNearDark: '#4f8d37', speck: '#a9d978',
    g: '#93cf5c', G: '#4b8a34', s: '#3f7e31', l: '#71b24a', L: '#3c7830',
    w: '#fffdf6', W: '#e6ddc6', y: '#f6c445', k: '#e5efb0',
    b: '#4f7be0', B: '#3157b9', c: '#9ab9f6',
    p: '#f59ab8', P: '#d9668f',
    r: '#e33d3a', R: '#a9232d', o: '#ff8c74',
    d: '#fff8e8', u: '#ffd23f', U: '#d9962b',
    star: '#fff8dc', firefly: '#ecff8c', wing: '#fff1a6', wing2: '#d8ecff', body: '#3b2f33', petal: '#f7b2c6', petal2: '#ffffff',
    paper: '#f5f5ed', outline: '#ffffff',
};

export const NIGHT: Palette = {
    sky0: '#0a1336', sky1: '#0d1946', sky2: '#122257', sky3: '#182d6a',
    cloudLight: '#c6daff', cloudMid: '#6a98e6', cloudShade: '#2d57bf', farLight: '#284aa6', farShade: '#1d388a',
    hillFarLight: '#213f5e', hillFar: '#1a3450', hillMidLight: '#22504a', hillMid: '#1a413d', hillNearLight: '#245944', hillNear: '#1b4737', hillNearDark: '#14382d', speck: '#2f6b52',
    g: '#2f6e4c', G: '#173d2f', s: '#1f4d39', l: '#2d6849', L: '#173c2e',
    w: '#d6deef', W: '#9aa6c2', y: '#d8b75c', k: '#8ea887',
    b: '#7393f2', B: '#4561c7', c: '#a9c1f8',
    p: '#d68cab', P: '#a3587c',
    r: '#e2575a', R: '#93303c', o: '#ff9b88',
    d: '#e9ecff', u: '#d9b44e', U: '#9c7430',
    star: '#fff3cf', firefly: '#e9ff7d', wing: '#cfd8f0', wing2: '#a7bde8', body: '#151a2c', petal: '#bca4d0', petal2: '#e6e8ff',
    paper: '#101f21', outline: '#fff3cf',
};

export function hexToRgb(hex: string): [number, number, number] {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
