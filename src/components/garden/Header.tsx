'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, PixelFlower, SunIcon } from './icons';
import { toggleTheme, useGarden } from './store';

export default function Header({ prefix = '', solid = false }: { prefix?: string; solid?: boolean }) {
  const g = useGarden();
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const f = () => setStuck(window.scrollY > 40);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  const dark = g.theme === 'dark';
  return (
    <header className={'gd-header' + (stuck || solid ? ' is-stuck' : '')}>
      <div className="gd-header-in">
        <a className="gd-mark" href={prefix + '#top'} aria-label="Prashant Chataut, home">
          <PixelFlower kind="sunflower" h={7} scale={2} />
          <span>Prashant<span className="gd-mark-more"> Chataut</span></span>
        </a>
        <nav className="gd-nav" aria-label="Main navigation">
          <a href={prefix + '#work'}>Work</a>
          <a href={prefix + '#about'}>About</a>
          <a href={prefix + '#writing'}>Writing</a>
          <a className="gd-nav-contact" href={prefix + '#contact'}>Contact</a>
        </nav>
        <button type="button" className="gd-toggle gd-box" onClick={toggleTheme} aria-label={dark ? 'Switch to day' : 'Switch to night'} aria-pressed={dark}>
          {dark ? <SunIcon /> : <MoonIcon />}
          <span>{dark ? 'Day' : 'Night'}</span>
        </button>
      </div>
    </header>
  );
}
