'use client';
import { useEffect, useRef } from 'react';

const blooms = [
  {x:90,y:53,s:1.55}, {x:255,y:132,s:1.25}, {x:405,y:46,s:1.5},
  {x:635,y:120,s:1.35}, {x:824,y:49,s:1.55}, {x:930,y:155,s:1.15}
];
function Branches() {
 return <svg className="name-branches" viewBox="0 0 1000 220" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
   <g className="branch-lines"><path d="M-15 148 C90 196 130 51 248 115 S384 175 455 73 S610 15 675 116 S810 188 1015 85"/><path d="M20 170 C120 70 180 194 282 142 S420 20 510 88 S660 195 768 125 S905 34 1004 142"/>
   <path d="M145 113 Q115 65 92 52 M146 113 Q166 65 189 54 M315 130 Q305 80 280 66 M315 130 Q352 91 375 86 M555 104 Q536 48 510 35 M556 104 Q591 61 612 51 M740 129 Q719 81 700 74 M740 129 Q774 87 795 77 M880 117 Q858 65 840 53"/>
   <path className="leaf" d="M145 113 Q103 103 103 80 Q128 82 145 113 M146 113 Q184 95 185 71 Q160 75 146 113 M315 130 Q277 125 271 100 Q299 103 315 130 M315 130 Q357 112 357 91 Q330 98 315 130 M556 104 Q520 95 515 72 Q541 74 556 104 M556 104 Q592 85 591 62 Q567 70 556 104 M740 129 Q705 122 700 99 Q727 101 740 129 M740 129 Q775 111 775 89 Q750 95 740 129 M880 117 Q846 109 843 87 Q867 87 880 117"/></g>
   {blooms.map((b,i)=><g key={i} className="bloom" style={{'--b':i} as React.CSSProperties} transform={`translate(${b.x} ${b.y}) scale(${b.s})`}><path d="M0 -23 C10 -32 22 -24 22 -14 C35 -8 31 6 22 11 C22 24 9 29 0 24 C-12 30 -25 23 -23 12 C-35 7 -31 -8 -22 -13 C-23 -25 -10 -31 0 -23Z"/><path className="petal-line" d="M-16 -5 C-12 -19 8 -21 15 -9 C23 5 8 14 -3 10 C-12 7 -10 -5 -1 -8 C8 -11 13 -3 8 2 C4 6 -3 4 -4 1 M-20 10 Q-13 20 -3 15 M4 19 Q15 22 20 10"/></g>)}
 </svg>;
}
export function GardenName() {
 const name = useRef<HTMLHeadingElement>(null);
 useEffect(()=>{const el=name.current;if(!el || matchMedia("(prefers-reduced-motion: reduce)").matches)return;const observer=new IntersectionObserver(([entry])=>{el.classList.toggle("garden-in-view", entry.isIntersecting);},{threshold:.4});observer.observe(el);return()=>observer.disconnect();},[]);
 return <h1 ref={name} id="hero-title" className="garden-name" aria-label="Prashant Chataut">{['Prashant','Chataut'].map(word=><span className="garden-word" key={word}><span aria-hidden="true">{word}</span><Branches/></span>)}</h1>;
}

export function CursorButterflies() {
    const root = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
        const el = root.current; if (!el) return;
        let x = -100, y = -100, active = false, raf = 0, last = 0;
        const count = 2 + Math.floor(Math.random() * 4);
        const createButterfly = (i: number) => {
            const node = document.createElement('span'); node.className = 'cursor-butterfly';
            node.innerHTML = '<svg viewBox="0 0 36 30"><path class="wing" d="M17 14C11 1 1 2 3 10c1 4 6 5 11 6-5 1-8 4-6 7 2 3 7 0 10-6Z"/><path class="wing wing-right" d="M19 14C25 1 35 2 33 10c-1 4-6 5-11 6 5 1 8 4 6 7-2 3-7 0-10-6Z"/><path d="M18 12v8m0-8-3-4m3 4 3-4" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
            node.style.setProperty('--size', `${12 + Math.random()*8}px`); node.style.setProperty('--beat', `${.32 + Math.random()*.45}s`); el.appendChild(node);
            return {node, x: -100, y: -100, phase: Math.random()*6, speed: .025+Math.random()*.045, radius: 24+i*13};
        };
        const swarm = Array.from({length: count}, (_, i) => createButterfly(i));
        const population = window.setInterval(() => {
            const wanted = 2 + Math.floor(Math.random() * 4);
            while (swarm.length < wanted) { const b = createButterfly(swarm.length); b.x=x; b.y=y; swarm.push(b); }
            while (swarm.length > wanted) swarm.pop()?.node.remove();
        }, 7000);
        const tick = (time: number) => {
            if (time-last > 30 && active) { for (const b of swarm) { const a = time*.0008+b.phase; b.x += (x + Math.cos(a)*b.radius - b.x)*b.speed; b.y += (y + Math.sin(a*1.4)*b.radius*.7 - b.y)*b.speed; b.node.style.transform = `translate3d(${b.x}px,${b.y}px,0) rotate(${Math.sin(a)*18}deg)`; } last=time; }
            raf=requestAnimationFrame(tick);
        };
        const move=(e:PointerEvent)=>{x=e.clientX;y=e.clientY; if(!active){swarm.forEach(b=>{b.x=x;b.y=y}); active=true;el.classList.add('active');}};
        const leave=()=>{active=false;el.classList.remove('active');};
        window.addEventListener('pointermove',move); document.documentElement.addEventListener('pointerleave',leave); raf=requestAnimationFrame(tick);
        return ()=>{window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',leave);cancelAnimationFrame(raf);clearInterval(population);el.replaceChildren();};
    }, []);
    return <div ref={root} className="cursor-garden" aria-hidden="true" />;
}
