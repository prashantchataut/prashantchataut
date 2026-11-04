/* Pixel garden scene engine.
   Everything is drawn on a tiny canvas (one logical pixel = `px` css pixels)
   and scaled up with image-rendering: pixelated, so the whole thing stays crisp. */

export type Mode = 'day' | 'night' | 'dusk';

export interface Species {
  petals: number;
  r: number;
  ps: number;
  petal: string;
  dark: string;
  center: string;
  cr: number;
}

export interface FlowerSpec {
  id: string;
  fx: number; // 0..1 across the scene
  rel: number; // 0..1 how far down the front hill
  h: number; // stem height in logical px
  sp: Species;
  lean: number;
}

export interface Anchor {
  id: string;
  x: number; // css px, flower head
  y: number;
  baseX: number; // css px, ground under the flower
  baseY: number;
}

export const SPECIES: Record<string, Species> = {
  sunflower: { petals: 12, r: 4.6, ps: 3, petal: '#ffd23f', dark: '#e59a12', center: '#6b3b1b', cr: 2.6 },
  forgetmenot: { petals: 5, r: 3.2, ps: 3, petal: '#7ba6ff', dark: '#3f6be0', center: '#ffe27a', cr: 1.4 },
  cosmos: { petals: 8, r: 4.2, ps: 3, petal: '#ff9cc7', dark: '#dc5c97', center: '#fff0a6', cr: 1.7 },
  rhododendron: { petals: 5, r: 3.8, ps: 3, petal: '#f0483f', dark: '#a8222f', center: '#ffd7a0', cr: 1.5 },
  daisy: { petals: 8, r: 3.4, ps: 2, petal: '#fffdf3', dark: '#cfc9b0', center: '#ffcf3a', cr: 1.5 },
  poppy: { petals: 6, r: 3.2, ps: 2, petal: '#ff8a3d', dark: '#cf5518', center: '#3a2a1a', cr: 1.3 },
  lilac: { petals: 6, r: 3.2, ps: 2, petal: '#b9a0ff', dark: '#7d62dc', center: '#ffffff', cr: 1.2 },
  blush: { petals: 7, r: 3.0, ps: 2, petal: '#ffb3cf', dark: '#e77aa6', center: '#ffe9a6', cr: 1.3 },
};
export const WILD = ['daisy', 'poppy', 'lilac', 'blush', 'cosmos', 'forgetmenot'];

interface Pal {
  sky: string[];
  cloud: [string, string, string];
  hillBack: string[];
  hill: string[];
  sun: [string, string];
  halo: string;
  moon: string;
  star: string;
  stem: string;
  stemHi: string;
  leaf: string;
  leafHi: string;
}

const PAL: Record<Mode, Pal> = {
  day: {
    sky: ['#3f82dc', '#5b9be6', '#7db4ee', '#9fc9f4', '#bfdcf7', '#dcedf9'],
    cloud: ['#ffffff', '#e8f0fa', '#b9cde8'],
    hillBack: ['#2d6c2a', '#38802f', '#459238'],
    hill: ['#3a8a2b', '#4ea132', '#66b73b', '#84ca49', '#a3dc61'],
    sun: ['#fffbd2', '#ffe56f'],
    halo: '#fff2a8',
    moon: '#f6f1d9',
    star: '#ffffff',
    stem: '#2c7a2a',
    stemHi: '#4cae3c',
    leaf: '#3a9a35',
    leafHi: '#78d05a',
  },
  night: {
    sky: ['#050921', '#09103a', '#0e1a52', '#15286e', '#1f3d8f', '#2f55ad'],
    cloud: ['#c9defa', '#6b9ae0', '#27519f'],
    hillBack: ['#0a2226', '#0f2f2f', '#153c37'],
    hill: ['#12372e', '#1a483b', '#235947', '#2e6c57', '#3b806a'],
    sun: ['#ffffff', '#ffffff'],
    halo: '#9db8ff',
    moon: '#f6f1d9',
    star: '#f3f6ff',
    stem: '#1f6a3a',
    stemHi: '#3b9a58',
    leaf: '#2a8148',
    leafHi: '#58bd7a',
  },
  dusk: {
    sky: ['#2a2a6c', '#523f8e', '#8458a3', '#bd6f9f', '#ee8f82', '#ffc47c'],
    cloud: ['#ffdcc2', '#e79db2', '#8a5a9c'],
    hillBack: ['#2a2856', '#383364', '#473f72'],
    hill: ['#2b5638', '#3a683e', '#4c7e45', '#62934d', '#79a857'],
    sun: ['#fff1c4', '#ffd27a'],
    halo: '#ffc58a',
    moon: '#fdf1d8',
    star: '#fff0e0',
    stem: '#2a6a30',
    stemHi: '#4a9a45',
    leaf: '#357f3a',
    leafHi: '#6cb85a',
  },
};

type RGB = [number, number, number];
const rgb = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const bay = (x: number, y: number) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
const hash = (x: number, y: number, s = 0) => {
  let n = Math.imul(x + s * 131, 374761393) + Math.imul(y, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
};
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const mulberry = (a: number) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

function pickBand(bands: RGB[], f: number, x: number, y: number): RGB {
  const v = clamp(f) * (bands.length - 1);
  const i = Math.min(bands.length - 2, Math.floor(v));
  return v - i > bay(x, y) ? bands[i + 1] : bands[i];
}

function layer(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  return { c, ctx, img: ctx.createImageData(w, h) };
}
function put(img: ImageData, x: number, y: number, col: RGB, a = 255) {
  const i = (y * img.width + x) * 4;
  img.data[i] = col[0];
  img.data[i + 1] = col[1];
  img.data[i + 2] = col[2];
  img.data[i + 3] = a;
}

function makeCloud(w: number, h: number, seed: number, pal: Pal) {
  const L = layer(w, h);
  const rnd = mulberry(seed);
  const n = 3 + Math.floor(rnd() * 3);
  const bumps: { cx: number; cy: number; r: number }[] = [];
  for (let i = 0; i < n; i++) {
    const r = h * (0.32 + rnd() * 0.3);
    const cx = w * (0.16 + (0.68 * i) / (n - 1)) + (rnd() - 0.5) * 3;
    bumps.push({ cx, cy: h - 2 - r * (0.55 + rnd() * 0.25), r });
  }
  const cols = pal.cloud.map(rgb);
  const top = new Array(w).fill(h);
  const inside = (x: number, y: number) => y <= h - 2 && bumps.some((b) => (x - b.cx) ** 2 + (y - b.cy) ** 2 <= b.r * b.r);
  for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) if (inside(x, y)) { top[x] = y; break; }
  for (let x = 0; x < w; x++)
    for (let y = top[x]; y < h; y++) {
      if (!inside(x, y)) continue;
      const t = (y - top[x]) / (h * 0.75) + (y / h) * 0.25;
      put(L.img, x, y, pickBand(cols, t * 1.15, x, y));
    }
  L.ctx.putImageData(L.img, 0, 0);
  return L.c;
}

function makeOrb(kind: 'sun' | 'moon', pal: Pal) {
  const R = 22;
  const S = R * 2 + 1;
  const L = layer(S, S);
  const core = rgb(kind === 'sun' ? pal.sun[1] : pal.moon);
  const hi = rgb(kind === 'sun' ? pal.sun[0] : pal.moon);
  const halo = rgb(pal.halo);
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const dx = x - R, dy = y - R;
      const d = Math.hypot(dx, dy);
      const rad = kind === 'sun' ? 6.5 : 6;
      if (d <= rad) {
        if (kind === 'moon') {
          const cut = Math.hypot(dx - 3.2, dy + 1.8) <= rad - 0.6;
          if (cut) {
            if (bay(x, y) < 0.18) put(L.img, x, y, halo, 120);
            continue;
          }
          put(L.img, x, y, d < rad - 2 ? hi : core);
        } else put(L.img, x, y, d < 4.2 ? hi : core);
      } else if (d <= R) {
        const p = (1 - (d - rad) / (R - rad)) ** 1.6 * (kind === 'sun' ? 0.55 : 0.4);
        if (bay(x, y) < p) put(L.img, x, y, halo, 190);
      }
    }
  L.ctx.putImageData(L.img, 0, 0);
  return L.c;
}


export function paintHead(ctx: CanvasRenderingContext2D, sp: Species, cx: number, cy: number, boost: number, t: number) {
  const R = sp.r + boost;
  const rot = Math.sin(t * 0.7) * 0.18;
  const half = sp.ps >> 1;
  for (let pass = 0; pass < 2; pass++) {
    ctx.fillStyle = pass === 0 ? sp.dark : sp.petal;
    for (let i = 0; i < sp.petals; i++) {
      const a = (i / sp.petals) * Math.PI * 2 + rot;
      const px = Math.round(cx + Math.cos(a) * R) - half;
      const py = Math.round(cy + Math.sin(a) * R) - half + (pass === 0 ? 1 : 0);
      ctx.fillRect(px, py, sp.ps, sp.ps);
    }
  }
  const cr = sp.cr + boost * 0.2;
  for (let dy = -Math.ceil(cr); dy <= cr; dy++)
    for (let dx = -Math.ceil(cr); dx <= cr; dx++) {
      if (dx * dx + dy * dy > cr * cr + 0.4) continue;
      ctx.fillStyle = sp.center;
      ctx.fillRect(Math.round(cx) + dx, Math.round(cy) + dy, 1, 1);
      if (dx === -1 && dy === -1 && cr > 1.8) {
        ctx.fillStyle = 'rgba(255,255,255,.35)';
        ctx.fillRect(Math.round(cx) + dx, Math.round(cy) + dy, 1, 1);
      }
    }
}

interface Planted extends FlowerSpec { t0: number; }
interface Petal { x: number; y: number; vy: number; ph: number; c: string; s: number; }
interface Fly { x: number; y: number; ph: number; sp: number; ax: number; ay: number; }
interface Butterfly { x: number; y: number; vx: number; vy: number; tx: number; ty: number; next: number; c: [string, string]; ph: number; }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; c: string; }

export interface SceneOpts {
  mode: Mode;
  hour: number;
  project: FlowerSpec[];
  plantable?: boolean;
  butterflies?: number;
  petals?: number;
  fireflies?: number;
  minHeight?: number;
  hillBias?: number; // 0..1 vertical position of the front hill
}

const STORE = 'garden-v1';

export class Scene {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  opts: SceneOpts;
  px = 4;
  W = 0;
  H = 0;
  sky!: HTMLCanvasElement;
  land!: HTMLCanvasElement;
  clouds: { c: HTMLCanvasElement; x: number; y: number; v: number }[] = [];
  orb!: HTMLCanvasElement;
  stars: { x: number; y: number; ph: number }[] = [];
  planted: Planted[] = [];
  petals: Petal[] = [];
  flies: Fly[] = [];
  bfs: Butterfly[] = [];
  sparks: Spark[] = [];
  hover = -1;
  boost: number[] = [];
  pointer: { x: number; y: number; on: boolean } = { x: 0, y: 0, on: false };
  shoot = { t: 0, x: 0, y: 0, on: false, next: 6 };
  now = 0;
  readonly seed = 7;

  constructor(canvas: HTMLCanvasElement, opts: SceneOpts) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.opts = opts;
    this.boost = opts.project.map(() => 0);
    if (opts.plantable) this.load();
  }

  get pal() { return PAL[this.opts.mode]; }

  backY(x: number) {
    const { W, H } = this;
    return H * 0.6 + Math.sin((x / W) * 3.1 + 0.6) * H * 0.04 + Math.sin((x / W) * 7.3 + 2) * H * 0.012;
  }
  frontY(x: number) {
    const { W, H } = this;
    const b = this.opts.hillBias ?? 0.78;
    return H * b - H * 0.085 * (0.5 + 0.5 * Math.sin((x / W) * Math.PI * 1.35 + 0.95)) + Math.sin((x / W) * 9) * H * 0.006;
  }

  resize(cssW: number, cssH: number, dpr = 1) {
    void dpr;
    this.px = Math.max(3, Math.round(cssH / 190));
    if (cssW < 520) this.px = 3;
    this.W = Math.max(40, Math.ceil(cssW / this.px));
    this.H = Math.max(40, Math.ceil(cssH / this.px));
    this.canvas.width = this.W;
    this.canvas.height = this.H;
    this.ctx.imageSmoothingEnabled = false;
    this.build();
  }

  setMode(mode: Mode, hour: number) {
    this.opts.mode = mode;
    this.opts.hour = hour;
    if (this.W) this.build();
  }

  build() {
    const { W, H } = this;
    const pal = this.pal;
    // sky
    const S = layer(W, H);
    const sky = pal.sky.map(rgb);
    const horizon = H * 0.68;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) put(S.img, x, y, pickBand(sky, y / horizon, x, y));
    this.stars = [];
    if (this.opts.mode !== 'day') {
      const sc = rgb(pal.star);
      const dens = this.opts.mode === 'night' ? 0.016 : 0.006;
      for (let y = 0; y < H * 0.55; y++)
        for (let x = 0; x < W; x++)
          if (hash(x, y, 3) < dens * (1 - y / (H * 0.6))) {
            if (hash(x, y, 9) < 0.28) this.stars.push({ x, y, ph: hash(x, y, 5) * 6.28 });
            else put(S.img, x, y, sc, hash(x, y, 4) < 0.5 ? 255 : 170);
          }
    }
    S.ctx.putImageData(S.img, 0, 0);
    this.sky = S.c;
    // land
    const Ld = layer(W, H);
    const back = pal.hillBack.map(rgb);
    const front = pal.hill.map(rgb);
    for (let x = 0; x < W; x++) {
      const by = Math.floor(this.backY(x));
      const fy = Math.floor(this.frontY(x));
      const bs = this.backY(x + 2) - this.backY(x - 2);
      for (let y = by; y < H; y++) {
        if (y < fy) {
          const t = 0.35 - bs * 0.22 + (y - by) / (H * 0.2) * 0.3;
          put(Ld.img, x, y, pickBand(back, t, x, y));
        } else {
          const s = (this.frontY(x + 3) - this.frontY(x - 3)) / 6;
          let t = 0.62 - s * 1.4 - ((y - fy) / (H * 0.3)) * 0.5;
          const n = hash(x, y, 11);
          if (n < 0.05) t += 0.2;
          else if (n > 0.95) t -= 0.2;
          put(Ld.img, x, y, pickBand(front, t, x, y));
        }
      }
    }
    Ld.ctx.putImageData(Ld.img, 0, 0);
    this.land = Ld.c;
    // clouds
    const rnd = mulberry(this.seed + (this.opts.mode === 'night' ? 3 : 0));
    this.clouds = [];
    const count = Math.max(4, Math.round(W / 70));
    for (let i = 0; i < count; i++) {
      const w = 34 + Math.floor(rnd() * 46);
      const h = 12 + Math.floor(rnd() * 12);
      this.clouds.push({ c: makeCloud(w, h, 100 + i * 17, pal), x: rnd() * (W + 60) - 30, y: H * (0.1 + rnd() * 0.42), v: 0.7 + rnd() * 1.4 });
    }
    // sun / moon
    this.orb = makeOrb(this.opts.mode === 'night' ? 'moon' : 'sun', pal);
    // particles
    const r2 = mulberry(21);
    this.petals = [];
    const pc = this.opts.mode === 'night' ? 0 : (this.opts.petals ?? 0);
    const petalCols = ['#ffb3cf', '#ffffff', '#ffd1e3', '#ffe38a'];
    for (let i = 0; i < pc; i++) this.petals.push({ x: r2() * W, y: r2() * H * 0.8, vy: 3 + r2() * 4, ph: r2() * 6.28, c: petalCols[i % 4], s: r2() < 0.4 ? 2 : 1 });
    this.flies = [];
    const fc = this.opts.mode === 'day' ? 0 : (this.opts.fireflies ?? 0);
    for (let i = 0; i < fc; i++) this.flies.push({ x: r2() * W, y: H * (0.5 + r2() * 0.45), ph: r2() * 6.28, sp: 0.5 + r2() * 0.9, ax: 6 + r2() * 14, ay: 3 + r2() * 8 });
    this.bfs = [];
    const bc = this.opts.mode === 'night' ? 0 : (this.opts.butterflies ?? 0);
    const bcols: [string, string][] = [['#ff8fb8', '#ffd1e3'], ['#ffd23f', '#fff2a8'], ['#9ab8ff', '#e0eaff']];
    for (let i = 0; i < bc; i++) this.bfs.push({ x: r2() * W, y: H * (0.55 + r2() * 0.2), vx: 0, vy: 0, tx: r2() * W, ty: H * 0.6, next: 0, c: bcols[i % 3], ph: r2() * 6 });
  }

  /* ---------- flowers ---------- */
  all(): FlowerSpec[] {
    return [...this.opts.project, ...this.planted];
  }

  groundY(f: FlowerSpec) {
    const x = f.fx * this.W;
    const fy = this.frontY(x);
    return Math.round(fy + 3 + f.rel * (this.H - fy - 6));
  }

  anchors(): Anchor[] {
    const t = this.now;
    return this.opts.project.map((f, i) => {
      const gy = this.groundY(f);
      const x = f.fx * this.W;
      const hv = this.headPos(f, gy, t, 1);
      void i;
      return { id: f.id, x: hv.x * this.px, y: hv.y * this.px, baseX: x * this.px, baseY: gy * this.px };
    });
  }

  headPos(f: FlowerSpec, gy: number, t: number, grow: number) {
    const hh = Math.floor(f.h * grow);
    const sway = Math.sin(t * 1.25 + f.fx * 9) * (1.1 + f.h / 30);
    return { x: Math.round(f.fx * this.W + f.lean + sway), y: gy - hh };
  }

  drawFlower(f: FlowerSpec, t: number, grow: number, boost: number) {
    const { ctx } = this;
    const pal = this.pal;
    const gy = this.groundY(f);
    const bx = Math.round(f.fx * this.W);
    const hh = Math.floor(f.h * clamp(grow));
    const amp = 1.1 + f.h / 30;
    const sw = Math.sin(t * 1.25 + f.fx * 9) * amp;
    const thick = f.h > 26 ? 2 : 1;
    // shadow on grass
    ctx.fillStyle = 'rgba(0,0,0,.18)';
    ctx.fillRect(bx - 3, gy, 7, 1);
    let topX = bx;
    for (let i = 0; i <= hh; i++) {
      const fr = f.h ? i / f.h : 0;
      const off = Math.round(sw * fr * fr + f.lean * fr * fr);
      const x = bx + off;
      ctx.fillStyle = pal.stem;
      ctx.fillRect(x, gy - i, thick, 1);
      if (thick === 2 || i % 3 === 0) {
        ctx.fillStyle = pal.stemHi;
        ctx.fillRect(x, gy - i, 1, 1);
      }
      topX = x;
    }
    // leaves
    [0.3, 0.55].forEach((p, k) => {
      if (hh < f.h * p + 2) return;
      const i = Math.floor(f.h * p);
      const fr = i / f.h;
      const off = Math.round(sw * fr * fr + f.lean * fr * fr);
      const dir = k % 2 ? -1 : 1;
      const x0 = bx + off + (dir > 0 ? thick : -1);
      const y0 = gy - i;
      const len = f.h > 26 ? 5 : 3;
      for (let j = 1; j <= len; j++) {
        const lift = Math.floor(j / 2.2) + Math.round(Math.sin(t * 1.6 + k) * (j > 2 ? 0.6 : 0));
        ctx.fillStyle = pal.leaf;
        ctx.fillRect(x0 + dir * j, y0 - lift, 1, 1);
        ctx.fillRect(x0 + dir * j, y0 - lift + 1, 1, 1);
        if (j > 1 && j < len) {
          ctx.fillStyle = pal.leafHi;
          ctx.fillRect(x0 + dir * j, y0 - lift - 1, 1, 1);
        }
      }
    });
    // head
    const hy = gy - hh;
    if (grow < 0.82) {
      ctx.fillStyle = f.sp.petal;
      ctx.fillRect(topX, hy - 1, 2, 2);
      ctx.fillStyle = pal.leaf;
      ctx.fillRect(topX, hy + 1, 2, 1);
      return;
    }
    this.drawHead(f.sp, topX, hy - 1, boost, t + f.fx * 5);
  }

  drawHead(sp: Species, cx: number, cy: number, boost: number, t: number) {
    paintHead(this.ctx, sp, cx, cy, boost, t);
  }

  /* ---------- interaction ---------- */
  setPointer(cssX: number, cssY: number, on: boolean) {
    this.pointer = { x: cssX / this.px, y: cssY / this.px, on };
  }

  plant(cssX: number, cssY: number): boolean {
    const x = cssX / this.px, y = cssY / this.px;
    const fy = this.frontY(x);
    if (y < fy + 2 || y > this.H - 2 || x < 3 || x > this.W - 3) return false;
    const tooClose = this.all().some((f) => Math.abs(f.fx * this.W - x) < 5 && Math.abs(this.groundY(f) - y) < 5);
    if (tooClose) return false;
    const key = WILD[Math.floor(Math.random() * WILD.length)];
    const f: Planted = {
      id: 'p' + Date.now(),
      fx: x / this.W,
      rel: clamp((y - fy - 3) / (this.H - fy - 6)),
      h: 12 + Math.floor(Math.random() * 12),
      sp: SPECIES[key],
      lean: Math.round((Math.random() - 0.5) * 3),
      t0: this.now,
    };
    this.planted.push(f);
    if (this.planted.length > 40) this.planted.shift();
    for (let i = 0; i < 7; i++) this.sparks.push({ x, y: y - 2, vx: (Math.random() - 0.5) * 16, vy: -8 - Math.random() * 10, life: 0.7 + Math.random() * 0.4, c: ['#fff2a8', '#ffb3cf', '#ffffff'][i % 3] });
    this.save();
    return true;
  }

  burst(i: number) {
    const f = this.opts.project[i];
    if (!f) return;
    const gy = this.groundY(f);
    const hp = this.headPos(f, gy, this.now, 1);
    for (let k = 0; k < 9; k++) this.sparks.push({ x: hp.x, y: hp.y, vx: (Math.random() - 0.5) * 24, vy: -6 - Math.random() * 12, life: 0.8 + Math.random() * 0.5, c: [f.sp.petal, '#ffffff', f.sp.dark][k % 3] });
  }

  clear() {
    this.planted = [];
    this.save();
  }

  private save() {
    try {
      localStorage.setItem(STORE, JSON.stringify(this.planted.map((p) => ({ fx: p.fx, rel: p.rel, h: p.h, lean: p.lean, k: Object.keys(SPECIES).find((k) => SPECIES[k] === p.sp) }))));
    } catch { /* storage unavailable */ }
  }
  private load() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE) || '[]');
      this.planted = raw.slice(-40).map((p: { fx: number; rel: number; h: number; lean: number; k: string }, i: number) => ({ id: 'l' + i, fx: p.fx, rel: p.rel, h: p.h, lean: p.lean, sp: SPECIES[p.k] ?? SPECIES.daisy, t0: -10 }));
    } catch { this.planted = []; }
  }

  /* ---------- frame ---------- */
  sunPos(): { x: number; y: number } {
    const { W, H } = this;
    const hr = this.opts.hour;
    const hor = H * 0.6;
    if (this.opts.mode === 'dusk') return { x: W * 0.74, y: hor - H * 0.03 };
    let p: number;
    if (this.opts.mode === 'day') p = clamp((hr - 6) / 12);
    else p = clamp(((hr >= 18 ? hr - 18 : hr + 6) / 12));
    return { x: W * (0.1 + 0.8 * p), y: hor - Math.sin(Math.PI * p) * (hor * 0.82) + 4 };
  }

  frame(t: number, dt: number, animate = true) {
    const { ctx, W, H } = this;
    this.now = t;
    const mode = this.opts.mode;
    const pal = this.pal;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(this.sky, 0, 0);
    // twinkle
    for (const s of this.stars) {
      const a = 0.35 + 0.65 * Math.max(0, Math.sin(t * 1.6 + s.ph));
      ctx.globalAlpha = animate ? a : 1;
      ctx.fillStyle = pal.star;
      ctx.fillRect(s.x, s.y, 1, 1);
      if (a > 0.9) {
        ctx.fillRect(s.x - 1, s.y, 1, 1); ctx.fillRect(s.x + 1, s.y, 1, 1);
        ctx.fillRect(s.x, s.y - 1, 1, 1); ctx.fillRect(s.x, s.y + 1, 1, 1);
      }
    }
    ctx.globalAlpha = 1;
    // sun / moon
    const sp = this.sunPos();
    ctx.drawImage(this.orb, Math.round(sp.x - 22), Math.round(sp.y - 22));
    // shooting star
    if (animate && mode === 'night') {
      const s = this.shoot;
      if (!s.on && t > s.next) { s.on = true; s.t = 0; s.x = W * (0.3 + Math.random() * 0.6); s.y = H * (0.05 + Math.random() * 0.2); }
      if (s.on) {
        s.t += dt;
        const k = s.t / 0.9;
        const x = s.x - k * 46, y = s.y + k * 20;
        for (let i = 0; i < 9; i++) {
          ctx.globalAlpha = (1 - i / 9) * (1 - k);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(Math.round(x + i * 2), Math.round(y - i * 0.9), 1, 1);
        }
        ctx.globalAlpha = 1;
        if (k >= 1) { s.on = false; s.next = t + 9 + Math.random() * 9; }
      }
    }
    // clouds
    for (const c of this.clouds) {
      if (animate) { c.x += c.v * dt; if (c.x > W + 4) c.x = -c.c.width - 4; }
      ctx.drawImage(c.c, Math.round(c.x), Math.round(c.y));
    }
    ctx.drawImage(this.land, 0, 0);
    // flowers, depth sorted
    const list = this.all().map((f, i) => ({ f, i, gy: this.groundY(f) })).sort((a, b) => a.gy - b.gy);
    const np = this.opts.project.length;
    for (const { f, i } of list) {
      const planted = i >= np;
      let g = 1;
      if (planted) {
        const age = t - (f as Planted).t0;
        g = clamp(age / 1.1);
        g = Math.floor(g * 8) / 8;
      } else {
        const age = t - 0.4 - i * 0.22;
        g = animate ? clamp(age / 1.4) : 1;
        g = Math.floor(g * 10) / 10;
      }
      if (!planted) {
        const target = this.hover === i ? 1 : 0;
        this.boost[i] += (target - this.boost[i]) * Math.min(1, dt * 10);
      }
      this.drawFlower(f, t, g, planted ? 0 : Math.round(this.boost[i] * 1.2));
    }
    // petals
    for (const p of this.petals) {
      if (animate) {
        p.y += p.vy * dt;
        p.x += (6 + Math.sin(t * 0.8 + p.ph) * 7) * dt;
        if (p.y > H * 0.92 || p.x > W + 3) { p.y = -3; p.x = Math.random() * W * 0.9 - W * 0.1; }
      }
      ctx.fillStyle = p.c;
      const flip = Math.sin(t * 3 + p.ph) > 0;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), flip ? p.s + 1 : p.s, p.s);
    }
    // fireflies
    for (const f of this.flies) {
      const x = f.x + Math.sin(t * f.sp + f.ph) * f.ax;
      const y = f.y + Math.cos(t * f.sp * 0.7 + f.ph) * f.ay;
      const a = Math.max(0, Math.sin(t * 1.4 * f.sp + f.ph * 3)) ** 3;
      if (a < 0.08) continue;
      ctx.globalAlpha = a * 0.35;
      ctx.fillStyle = '#e8ff7a';
      ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
      ctx.globalAlpha = a;
      ctx.fillStyle = '#fbffc4';
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
    ctx.globalAlpha = 1;
    // butterflies
    for (const b of this.bfs) {
      if (animate) {
        if (this.pointer.on && this.pointer.y < H) { b.tx = this.pointer.x + Math.sin(t + b.ph) * 8; b.ty = this.pointer.y - 6 + Math.cos(t * 1.3 + b.ph) * 5; }
        else if (t > b.next) { b.tx = Math.random() * W; b.ty = H * (0.45 + Math.random() * 0.35); b.next = t + 2 + Math.random() * 3; }
        b.vx += (b.tx - b.x) * dt * 1.4; b.vy += (b.ty - b.y) * dt * 1.4;
        b.vx *= 1 - dt * 2.2; b.vy *= 1 - dt * 2.2;
        b.x += b.vx * dt * 2.2; b.y += b.vy * dt * 2.2 + Math.sin(t * 6 + b.ph) * 0.15;
      }
      const x = Math.round(b.x), y = Math.round(b.y);
      const up = Math.floor(t * 7 + b.ph) % 2 === 0;
      ctx.fillStyle = '#23305f';
      ctx.fillRect(x, y, 1, 3);
      ctx.fillStyle = b.c[0];
      if (up) { ctx.fillRect(x - 3, y - 2, 3, 2); ctx.fillRect(x + 1, y - 2, 3, 2); ctx.fillStyle = b.c[1]; ctx.fillRect(x - 2, y - 1, 1, 1); ctx.fillRect(x + 2, y - 1, 1, 1); }
      else { ctx.fillRect(x - 2, y - 1, 2, 3); ctx.fillRect(x + 1, y - 1, 2, 3); ctx.fillStyle = b.c[1]; ctx.fillRect(x - 2, y, 1, 1); ctx.fillRect(x + 2, y, 1, 1); }
    }
    // sparks
    this.sparks = this.sparks.filter((s) => s.life > 0);
    for (const s of this.sparks) {
      s.life -= dt; s.vy += 26 * dt; s.x += s.vx * dt; s.y += s.vy * dt;
      ctx.globalAlpha = clamp(s.life * 1.6);
      ctx.fillStyle = s.c;
      ctx.fillRect(Math.round(s.x), Math.round(s.y), 1, 1);
    }
    ctx.globalAlpha = 1;
  }
}

/* Current time in Kathmandu as a decimal hour. */
export function nepalClock() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kathmandu', hour: 'numeric', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 12) % 24;
  const m = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  const label = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kathmandu', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date()).toLowerCase();
  return { hour: h + m / 60, label };
}
export const isDayAt = (hour: number) => hour >= 6 && hour < 18;
