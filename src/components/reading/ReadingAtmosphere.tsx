'use client';
import { useEffect, useRef } from 'react';
export default function ReadingAtmosphere({theme}: {theme:string}) {
 const ref=useRef<HTMLDivElement>(null); const bar=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const progress=()=>{const total=document.documentElement.scrollHeight-innerHeight;if(bar.current) bar.current.style.transform=`scaleX(${total>0?scrollY/total:0})`;};
  window.addEventListener('scroll',progress,{passive:true});progress();
  if(!matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return ()=>window.removeEventListener('scroll',progress);
  let last=0; const root=ref.current;
  const move=(e:PointerEvent)=>{const t=performance.now();if(t-last<130 || !root)return;last=t;const p=document.createElement('span'); p.className='reading-particle';p.style.left=`${e.clientX}px`;p.style.top=`${e.clientY}px`;p.style.setProperty('--drift',`${Math.random()*60-30}px`);p.style.setProperty('--turn',`${Math.random()*100-50}deg`); root.appendChild(p);setTimeout(()=>p.remove(),1800);};
  window.addEventListener('pointermove',move); return ()=>{window.removeEventListener('scroll',progress);window.removeEventListener('pointermove',move);};
 },[]);
 return <><div className={`reading-atmosphere atmosphere-${theme}`} ref={ref} aria-hidden="true"/><div className="reading-progress" aria-hidden="true"><div ref={bar}/></div></>;
}
