'use client';
import { useEffect, useRef } from 'react';

export function GardenName() {
    const words = ['Prashant', 'Chataut'];
    return <h1 id="hero-title" className="garden-name" aria-label="Prashant Chataut">{words.map((word, wi) => <span className="garden-word" key={word} aria-hidden="true">{Array.from(word).map((letter, i) => <span className="garden-letter" key={i} style={{'--i': wi * 8 + i} as React.CSSProperties}>{letter}<i className="letter-flower" /></span>)}</span>)}</h1>;
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
