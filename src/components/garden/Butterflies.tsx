'use client';
import { useEffect, useRef } from 'react';

/** A small cursor companion on fine pointers; the meadow has its own butterflies. */
export function CursorButterflies() {
 const root = useRef<HTMLDivElement>(null);
 useEffect(() => {
  if (!matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
  const el = root.current; if (!el) return;
  const nodes = Array.from({length: 2}, () => { const node = document.createElement('span'); node.className = 'cursor-butterfly'; node.innerHTML = '<svg viewBox="0 0 5 3" shape-rendering="crispEdges"><path fill="currentColor" d="M0 0h2v1H0zM3 0h2v1H3zM0 1h5v1H0zM1 2h3v1H1z"/></svg>'; el.appendChild(node); return {node, x:-100, y:-100}; });
  let x=0, y=0, active=false, raf=0;
  const move=(e:PointerEvent)=>{x=e.clientX;y=e.clientY;active=!(e.target instanceof Element && !!e.target.closest('.hero'));el.classList.toggle('active',active);};
  const leave=()=>{active=false;el.classList.remove('active');};
  const tick=(t:number)=>{if(active) nodes.forEach((b,i)=>{b.x+=(x+Math.cos(t/800+i*3)* (24+i*12)-b.x)*.07;b.y+=(y+Math.sin(t/900+i*3)*20-b.y)*.07;b.node.style.transform=`translate3d(${b.x}px,${b.y}px,0)`;});raf=requestAnimationFrame(tick);};
  window.addEventListener('pointermove',move);document.documentElement.addEventListener('pointerleave',leave);raf=requestAnimationFrame(tick);
  return ()=>{window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',leave);cancelAnimationFrame(raf);el.replaceChildren();};
 }, []);
 return <div ref={root} className="cursor-garden" aria-hidden="true" />;
}
