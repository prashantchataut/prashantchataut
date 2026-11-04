'use client';

import { useEffect, useRef, useState } from 'react';
import SceneView, { type SceneHandle } from './SceneView';
import Tufts from './Tufts';
import { Arrow, MoonIcon, SunIcon } from './icons';
import { flowerSpecs, person, projects } from './content';
import { routes } from './assets';
import { sceneHour, useGarden } from './store';
import type { Anchor, Mode } from './scene';

const hop = (word: string, start: number) =>
  word.split('').map((ch, i) => (
    <span key={i} className="gd-hop" style={{ ['--i' as string]: start + i }} aria-hidden="true">{ch}</span>
  ));

export default function Hero() {
  const g = useGarden();
  const mode: Mode = g.theme === 'dark' ? 'night' : 'day';
  const hour = sceneHour(g);
  const handle = useRef<SceneHandle>({ scene: null, redraw: () => {} });
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(-1);

  const hover = (i: number) => {
    const s = handle.current.scene;
    if (!s) return;
    if (s.hover !== i && i >= 0) s.burst(i);
    s.hover = i;
    handle.current.redraw();
  };
  useEffect(() => { hover(open); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(-1); };
    const down = (e: PointerEvent) => { if (!(e.target as HTMLElement).closest('[data-gd-keep]')) setOpen(-1); };
    window.addEventListener('keydown', key);
    window.addEventListener('pointerdown', down);
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', down); };
  }, []);

  const clear = () => { handle.current.scene?.clear(); setCount(0); handle.current.redraw(); };
  const a = open >= 0 ? anchors[open] : null;
  const p = open >= 0 ? projects[open] : null;
  const popLeft = a ? Math.min(Math.max(a.x, 150), Math.max(150, size.w - 150)) : 0;

  return (
    <section className="gd-hero" id="top" aria-labelledby="hero-title">
      <SceneView
        mode={mode}
        hour={hour}
        project={flowerSpecs}
        plantable
        butterflies={3}
        petals={9}
        fireflies={22}
        hillBias={0.78}
        handle={handle}
        onLayout={(an, w, h) => { setAnchors(an); setSize({ w, h }); }}
        onPlant={setCount}
        className="gd-hero-scene"
      />

      <div className="gd-hero-copy">
        <h1 id="hero-title" className="gd-title" aria-label={person.name}>
          <span className="gd-word">{hop('Prashant', 0)}</span>
          <span className="gd-word">{hop('Chataut', 8)}</span>
        </h1>
        <p className="gd-sub gd-box">{person.line}</p>
        <div className="gd-actions">
          <a className="gd-btn" href="#work">See my work <Arrow dir="down" /></a>
          <a className="gd-textlink" href={routes.writes}>Read my writing <Arrow /></a>
        </div>
      </div>

      <div className="gd-stage-ui" style={{ width: size.w, height: size.h }}>
        {anchors.map((an, i) => (
          <div key={an.id}>
            <div
              className="gd-hotspot"
              data-gd-keep
              style={{ left: an.x - 30, top: an.y - 30 }}
              onPointerEnter={() => hover(i)}
              onPointerLeave={() => hover(open)}
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-hidden="true"
            />
            <button
              type="button"
              className={'gd-stake' + (open === i ? ' is-open' : '')}
              data-gd-keep
              style={{ left: an.baseX, top: an.baseY + 6 }}
              aria-expanded={open === i}
              aria-controls="gd-pop"
              onPointerEnter={() => hover(i)}
              onPointerLeave={() => hover(open)}
              onFocus={() => hover(i)}
              onBlur={() => hover(open)}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              {projects[i].short}
            </button>
          </div>
        ))}

        {a && p && (
          <div
            id="gd-pop"
            className="gd-pop gd-box"
            data-gd-keep
            role="region"
            aria-label={p.name}
            style={{ left: popLeft, bottom: size.h - a.y + 34, ['--tail' as string]: `${a.x - popLeft + 140}px`, ['--tone' as string]: p.color }}
          >
            <p className="gd-pop-name">{p.name}</p>
            <p className="gd-pop-line">{p.blurb}</p>
            <div className="gd-pop-actions">
              <a className="gd-btn gd-btn--sm" href={p.primary.href} target="_blank" rel="noopener noreferrer">{p.primary.label} <Arrow /></a>
              <a className="gd-textlink" href={'#work-' + p.id} onClick={() => setOpen(-1)}>Read more <Arrow dir="down" /></a>
            </div>
            <button type="button" className="gd-pop-x" onClick={() => setOpen(-1)} aria-label="Close">
              <svg viewBox="0 0 7 7" width="14" height="14" shapeRendering="crispEdges" aria-hidden="true"><path d="M0 0h2v2H0zM5 0h2v2H5zM2 2h3v3H2zM0 5h2v2H0zM5 5h2v2H5z" fill="currentColor" /></svg>
            </button>
          </div>
        )}
      </div>

      <div className="gd-hero-foot">
        <p className="gd-chip gd-box" aria-live="off">
          <span className="gd-chip-ico">{g.theme === g.natural ? (g.natural === 'light' ? <SunIcon /> : <MoonIcon />) : g.theme === 'light' ? <SunIcon /> : <MoonIcon />}</span>
          {g.label ? <span>It is {g.label} in Kathmandu</span> : <span>Kathmandu, Nepal</span>}
        </p>
        <p className="gd-chip gd-box">
          {count === 0 ? <span>Click the grass to plant a flower</span> : (
            <>
              <span>{count} planted</span>
              <button type="button" className="gd-chip-btn" onClick={clear}>Pull them up</button>
            </>
          )}
        </p>
      </div>

      <Tufts />
    </section>
  );
}
