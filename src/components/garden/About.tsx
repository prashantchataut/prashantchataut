'use client';

import { useEffect, useRef } from 'react';
import { Arrow } from './icons';
import { img, routes } from './assets';
import { SPECIES, paintHead } from './scene';
import { onTick, prefersReducedMotion } from './store';

/* A rhododendron, Nepal's national flower, that grows as the section scrolls into view:
   a seed on the left, the person on the right. */
function GrowingPlant() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    const W = 40, H = 84;
    c.width = W; c.height = H;
    const reduced = prefersReducedMotion();
    let target = reduced ? 1 : 0, shown = reduced ? 1 : 0;
    const sp = SPECIES.rhododendron;
    const measure = () => {
      const r = c.getBoundingClientRect();
      const vh = window.innerHeight;
      target = Math.max(0, Math.min(1, (vh * 0.9 - r.top) / (vh * 0.62)));
    };
    const draw = (t: number) => {
      shown += (target - shown) * 0.25;
      if (Math.abs(target - shown) < 0.004) shown = target;
      ctx.clearRect(0, 0, W, H);
      // soil
      for (let x = 6; x < 34; x++) {
        const d = Math.round(Math.sqrt(Math.max(0, 1 - ((x - 20) / 14) ** 2)) * 6);
        ctx.fillStyle = '#6b4a2b';
        ctx.fillRect(x, H - d, 1, d);
        ctx.fillStyle = '#8a6239';
        if (d > 1) ctx.fillRect(x, H - d, 1, 1);
      }
      const maxH = 58;
      const h = Math.floor(maxH * Math.min(1, shown / 0.85));
      const sw = Math.sin(t * 1.3) * 1.4;
      const hy = H - 5 - h;
      for (let i = 0; i < h; i++) {
        const fr = i / maxH;
        const x = 20 + Math.round(sw * fr * fr);
        ctx.fillStyle = '#2c7a2a'; ctx.fillRect(x, H - 6 - i, 2, 1);
        ctx.fillStyle = '#4cae3c'; ctx.fillRect(x, H - 6 - i, 1, 1);
      }
      const leaf = (frac: number, dir: number, len: number) => {
        if (h < maxH * frac + 3) return;
        const i = Math.floor(maxH * frac);
        const fr = i / maxH;
        const x0 = 20 + Math.round(sw * fr * fr) + (dir > 0 ? 2 : -1);
        for (let j = 1; j <= len; j++) {
          const lift = Math.floor(j / 2.3);
          ctx.fillStyle = '#3a9a35'; ctx.fillRect(x0 + dir * j, H - 6 - i - lift, 1, 2);
          if (j > 1 && j < len) { ctx.fillStyle = '#78d05a'; ctx.fillRect(x0 + dir * j, H - 7 - i - lift, 1, 1); }
        }
      };
      leaf(0.2, 1, 6); leaf(0.34, -1, 6); leaf(0.5, 1, 5); leaf(0.64, -1, 5);
      const tx = 20 + Math.round(sw * (h / maxH) ** 2);
      if (shown < 0.14) { ctx.fillStyle = '#d9c28a'; ctx.fillRect(19, H - 7, 3, 2); }
      else if (shown < 0.85) { ctx.fillStyle = '#3a9a35'; ctx.fillRect(tx, hy - 2, 2, 2); }
      else paintHead(ctx, sp, tx, hy - 3, shown > 0.97 ? 1 : 0, t);
    };
    measure(); draw(0);
    if (reduced) return;
    const off = onTick((t) => draw(t));
    const f = () => measure();
    window.addEventListener('scroll', f, { passive: true });
    window.addEventListener('resize', f);
    // draw faster while growing
    let raf = 0;
    const smooth = () => { raf = requestAnimationFrame(smooth); if (Math.abs(target - shown) > 0.004) draw(performance.now() / 1000); };
    raf = requestAnimationFrame(smooth);
    return () => { off(); window.removeEventListener('scroll', f); window.removeEventListener('resize', f); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} className="gd-plant" aria-hidden="true" />;
}

export default function About() {
  return (
    <section id="about" className="gd-section gd-about" aria-labelledby="about-title">
      <div className="gd-about-copy">
        <h2 id="about-title" className="gd-h2">Hi, I’m Prashant.</h2>
        <p>I’m a developer from Nepal. I make apps to solve things that matter to me.</p>
        <p>I started building in grade 10. Since then I’ve worked on everything from study resources to a Game Boy Advance emulator.</p>
        <a className="gd-textlink" href={routes.story}>How the projects began <Arrow /></a>
      </div>
      <div className="gd-thennow">
        <figure className="gd-polaroid gd-polaroid--then">
          <img src={img.child} width={800} height={800} alt="Illustrated portrait of Prashant as a child" loading="lazy" />
          <figcaption>Then</figcaption>
        </figure>
        <div className="gd-plant-wrap">
          <GrowingPlant />
          <p className="gd-plant-note">Rhododendron, Nepal’s national flower</p>
        </div>
        <figure className="gd-polaroid gd-polaroid--now">
          <img src={img.present} width={800} height={800} alt="Illustrated portrait of Prashant today" loading="lazy" />
          <figcaption>Now</figcaption>
        </figure>
      </div>
    </section>
  );
}
