'use client';

import { useRef } from 'react';
import SceneView, { type SceneHandle } from './SceneView';
import Tufts from './Tufts';
import { Arrow } from './icons';
import { person } from './content';
import { routes } from './assets';
import { SPECIES, type FlowerSpec } from './scene';
import { useGarden } from './store';

const bed: FlowerSpec[] = [
  { id: 'f1', fx: 0.1, rel: 0.45, h: 20, sp: SPECIES.sunflower, lean: -1 },
  { id: 'f2', fx: 0.3, rel: 0.2, h: 15, sp: SPECIES.forgetmenot, lean: 1 },
  { id: 'f3', fx: 0.7, rel: 0.25, h: 18, sp: SPECIES.cosmos, lean: -1 },
  { id: 'f4', fx: 0.9, rel: 0.5, h: 22, sp: SPECIES.rhododendron, lean: 1 },
];

export default function Footer({ prefix = '', nowHref = routes.now }: { prefix?: string; nowHref?: string }) {
  const g = useGarden();
  const handle = useRef<SceneHandle>({ scene: null, redraw: () => {} });
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className="gd-footer">
      <Tufts variant="cloud" />
      <SceneView
        mode={g.theme === 'dark' ? 'night' : 'dusk'}
        hour={20}
        project={bed}
        petals={4}
        fireflies={28}
        hillBias={0.8}
        handle={handle}
        className="gd-footer-scene"
      />
      <div className="gd-footer-copy">
        <h2 className="gd-title gd-title--sm">Let’s talk.</h2>
        <a className="gd-mail gd-box" href={'mailto:' + person.email}>{person.email} <Arrow /></a>
        <ul className="gd-links">
          <li><a href={person.github}>GitHub <Arrow /></a></li>
          <li><a href={person.instagram}>Instagram <Arrow /></a></li>
          <li><a href={nowHref}>Now</a></li>
          <li><a href={prefix + '#top'}>Back to top <Arrow dir="down" /></a></li>
        </ul>
        <p className="gd-copy">© {year} Prashant Chataut</p>
      </div>
    </footer>
  );
}
