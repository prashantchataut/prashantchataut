/*
 * A tiny spring-driven flower garden for SVG. Flowers bloom with a springy overshoot when the garden becomes visible,
 * breathe and turn while the page scrolls, lean up toward the pointer, and shed petals when clicked or tapped.
 * Only transforms are written, and the loop sleeps entirely while the garden is off screen.
 */

export type Item = { el: SVGGElement; x: number; y: number; r: number; delay: number; dir: number; color: string };
type State = Item & { b: number; bv: number; rot: number; rv: number; hover: number };
type Petal = { el: SVGEllipseElement; x: number; y: number; vx: number; vy: number; rot: number; vr: number; life: number };

export type GardenOptions = { turn?: number; layer: SVGGElement; reactToScroll?: boolean };

export class Garden {
    private s: State[];
    private petals: Petal[] = [];
    private raf = 0;
    private last = 0;
    private visible = false;
    private t0 = 0;
    private px = -999;
    private py = -999;
    private boost = 0;
    private lastY = 0;
    private reduced: boolean;

    constructor(private svg: SVGSVGElement, items: Item[], private o: GardenOptions) {
        this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.s = items.map((i) => ({ ...i, b: this.reduced ? 1 : 0, bv: 0, rot: this.reduced ? 0 : i.dir * -110, rv: 0, hover: 0 }));
        this.paint();
    }

    private paint() {
        for (const f of this.s) {
            f.el.setAttribute('transform', `translate(${f.x} ${f.y}) rotate(${f.rot.toFixed(1)}) scale(${Math.max(0, f.b).toFixed(3)})`);
        }
    }

    mount() {
        if (this.reduced) return () => {};
        this.lastY = scrollY;
        const io = new IntersectionObserver(([e]) => this.setVisible(e.isIntersecting));
        io.observe(this.svg);
        const move = (e: PointerEvent) => {
            const r = this.svg.getBoundingClientRect();
            this.px = e.clientX - r.left;
            this.py = e.clientY - r.top;
        };
        const leave = () => { this.px = -999; this.py = -999; };
        const down = (e: PointerEvent) => {
            move(e);
            let best: State | null = null, bd = Infinity;
            for (const f of this.s) {
                const d = Math.hypot(this.px - f.x, this.py - f.y);
                if (d < f.r * 1.9 && d < bd) { best = f; bd = d; }
            }
            if (best) this.pop(best);
            if (e.pointerType === 'touch') setTimeout(leave, 600);
        };
        addEventListener('pointermove', move, { passive: true });
        addEventListener('pointerdown', down, { passive: true });
        document.documentElement.addEventListener('pointerleave', leave);
        return () => {
            io.disconnect();
            cancelAnimationFrame(this.raf);
            this.raf = 0;
            removeEventListener('pointermove', move);
            removeEventListener('pointerdown', down);
            document.documentElement.removeEventListener('pointerleave', leave);
            this.petals.forEach((p) => p.el.remove());
            this.petals = [];
        };
    }

    private setVisible(v: boolean) {
        if (v === this.visible) return;
        this.visible = v;
        if (v) {
            this.t0 = performance.now();
            this.wake();
        } else {
            for (const f of this.s) { f.b = 0; f.bv = 0; f.rot = f.dir * -110; f.rv = 0; }
            this.paint();
        }
    }

    private wake() {
        if (this.raf) return;
        this.last = 0;
        this.raf = requestAnimationFrame(this.tick);
    }

    private pop(f: State) {
        f.b = 0.2;
        f.bv = 7;
        f.rv += f.dir * 260;
        const n = 8 + Math.floor(Math.random() * 5);
        for (let i = 0; i < n && this.petals.length < 48; i++) {
            const el = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            const rx = 2.6 + Math.random() * 2.4;
            el.setAttribute('rx', String(rx));
            el.setAttribute('ry', String(rx * 1.7));
            el.style.fill = f.color;
            el.style.opacity = '0.95';
            this.o.layer.appendChild(el);
            const a = Math.random() * 6.2832;
            const v = 40 + Math.random() * 90;
            this.petals.push({ el, x: f.x, y: f.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 50, rot: Math.random() * 360, vr: (Math.random() - 0.5) * 520, life: 0 });
        }
        this.wake();
    }

    private tick = (now: number) => {
        const dt = Math.min((now - (this.last || now)) / 1000, 0.04);
        this.last = now;
        const y = scrollY;
        this.boost = Math.min(1, this.boost * Math.pow(0.04, dt) + Math.abs(y - this.lastY) / 70);
        this.lastY = y;
        const age = now - this.t0;
        const t = now / 1000;
        const turn = (this.o.turn ?? 0.16) * y;

        for (const f of this.s) {
            const on = this.visible && age > f.delay;
            const reach = f.r * 2.3;
            const d = Math.hypot(this.px - f.x, this.py - f.y);
            const h = d < reach ? 1 - d / reach : 0;
            f.hover += (h - f.hover) * Math.min(1, dt * 10);
            const target = on ? 1 + f.hover * 0.42 + this.boost * 0.2 + 0.05 * Math.sin(t * 1.7 + f.x * 0.04) : 0;
            f.bv += ((target - f.b) * 95 - f.bv * 11) * dt;
            f.b += f.bv * dt;
            const rt = on ? f.dir * (turn + f.hover * 34) + Math.sin(t * 0.9 + f.x * 0.03) * 3 : f.dir * -110;
            f.rv += ((rt - f.rot) * 38 - f.rv * 8.5) * dt;
            f.rot += f.rv * dt;
        }
        this.paint();

        for (let i = this.petals.length - 1; i >= 0; i--) {
            const p = this.petals[i];
            p.life += dt;
            if (p.life > 1.5) { p.el.remove(); this.petals.splice(i, 1); continue; }
            p.vy += 150 * dt;
            p.vx *= 0.985;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.rot += p.vr * dt;
            p.el.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.rot.toFixed(0)})`);
            p.el.style.opacity = String(Math.max(0, 1 - p.life / 1.5));
        }

        if (this.visible || this.petals.length) this.raf = requestAnimationFrame(this.tick);
        else this.raf = 0;
    };
}
