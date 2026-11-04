import { useSyncExternalStore } from 'react';
import { isDayAt, nepalClock } from './scene';

/* One tiny store for theme + the clock in Kathmandu.
   The site starts in whatever light it is in Nepal right now. A visitor can override it
   and that choice sticks. */

export type Theme = 'light' | 'dark';
interface State {
  theme: Theme;
  natural: Theme;
  hour: number;
  label: string;
  ready: boolean;
}

let state: State = { theme: 'light', natural: 'light', hour: 12, label: '', ready: false };
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const set = (p: Partial<State>) => {
  state = { ...state, ...p };
  emit();
};

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

let started = false;
export function startGarden() {
  if (started || typeof window === 'undefined') return;
  started = true;
  const tick = () => {
    const c = nepalClock();
    const natural: Theme = isDayAt(c.hour) ? 'light' : 'dark';
    set({ hour: c.hour, label: c.label, natural });
  };
  const c = nepalClock();
  const natural: Theme = isDayAt(c.hour) ? 'light' : 'dark';
  let stored: string | null = null;
  try { stored = localStorage.getItem('theme'); } catch { /* ignore */ }
  const theme: Theme = stored === 'dark' || stored === 'light' ? stored : natural;
  apply(theme);
  set({ theme, natural, hour: c.hour, label: c.label, ready: true });
  window.setInterval(tick, 30000);
}

export function toggleTheme() {
  const next: Theme = state.theme === 'light' ? 'dark' : 'light';
  apply(next);
  try { localStorage.setItem('theme', next); } catch { /* ignore */ }
  set({ theme: next });
}

export function useGarden() {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => subs.delete(cb); },
    () => state,
    () => state,
  );
}

/* The hour the painted sky should show: real Nepal time while the theme matches it,
   otherwise a sensible noon or midnight so the sun or moon is up. */
export function sceneHour(s: State) {
  if (s.theme === s.natural) return s.hour;
  return s.theme === 'light' ? 12 : 0.5;
}

/* shared 10fps ticker for the little decorative sprites */
const fns = new Set<(t: number) => void>();
let timer = 0;
export function onTick(fn: (t: number) => void) {
  fns.add(fn);
  if (!timer && typeof window !== 'undefined') {
    const t0 = performance.now();
    timer = window.setInterval(() => {
      if (document.hidden) return;
      const t = (performance.now() - t0) / 1000;
      fns.forEach((f) => f(t));
    }, 100);
  }
  return () => {
    fns.delete(fn);
    if (!fns.size && timer) { clearInterval(timer); timer = 0; }
  };
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
