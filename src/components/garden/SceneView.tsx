'use client';

import { useEffect, useRef } from 'react';
import { Scene, type Anchor, type FlowerSpec, type Mode } from './scene';
import { prefersReducedMotion } from './store';

export interface SceneHandle {
  scene: Scene | null;
  redraw: () => void;
}

interface Props {
  mode: Mode;
  hour: number;
  project: FlowerSpec[];
  plantable?: boolean;
  butterflies?: number;
  petals?: number;
  fireflies?: number;
  hillBias?: number;
  handle: React.MutableRefObject<SceneHandle>;
  onLayout?: (a: Anchor[], w: number, h: number) => void;
  onPlant?: (count: number) => void;
  className?: string;
}

export default function SceneView(p: Props) {
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const latest = useRef(p);
  latest.current = p;

  useEffect(() => {
    const canvas = cv.current!;
    const el = box.current!;
    const reduced = prefersReducedMotion();
    const scene = new Scene(canvas, {
      mode: p.mode, hour: p.hour, project: p.project, plantable: p.plantable,
      butterflies: p.butterflies, petals: p.petals, fireflies: p.fireflies, hillBias: p.hillBias,
    });
    const t0 = performance.now();
    let raf = 0, last = t0, visible = true;
    const now = () => (performance.now() - t0) / 1000;
    const still = () => scene.frame(now() + 5, 0, false);
    p.handle.current = { scene, redraw: () => { if (reduced) still(); } };

    const layout = () => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      scene.resize(r.width, r.height, window.devicePixelRatio || 1);
      latest.current.onLayout?.(scene.anchors(), r.width, r.height);
      latest.current.onPlant?.(scene.planted.length);
      if (reduced) still();
    };
    const ro = new ResizeObserver(layout);
    ro.observe(el);
    layout();

    const loop = (ms: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) { last = ms; return; }
      if (ms - last < 30) return;
      const dt = Math.min(0.1, (ms - last) / 1000);
      last = ms;
      scene.frame(now(), dt);
    };
    if (!reduced) raf = requestAnimationFrame(loop);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); p.handle.current = { scene: null, redraw: () => {} }; };
    // the scene is created once; mode and flowers are pushed in below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const s = p.handle.current.scene;
    if (!s) return;
    s.setMode(p.mode, p.hour);
    p.handle.current.redraw();
  }, [p.mode, p.hour, p.handle]);

  const rect = () => cv.current!.getBoundingClientRect();
  return (
    <div ref={box} className={'gd-scene ' + (p.className ?? '')}>
      <canvas
        ref={cv}
        className="gd-canvas"
        aria-hidden="true"
        onPointerMove={p.plantable ? (e) => { const r = rect(); p.handle.current.scene?.setPointer(e.clientX - r.left, e.clientY - r.top, true); } : undefined}
        onPointerLeave={p.plantable ? () => p.handle.current.scene?.setPointer(0, 0, false) : undefined}
        onPointerDown={p.plantable ? (e) => {
          const r = rect();
          const s = p.handle.current.scene;
          if (s?.plant(e.clientX - r.left, e.clientY - r.top)) { p.onPlant?.(s.planted.length); p.handle.current.redraw(); }
        } : undefined}
      />
    </div>
  );
}
