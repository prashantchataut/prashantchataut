'use client';

import { useEffect, useRef } from 'react';

function Butterfly({ className = '' }: { className?: string }) {
    return <svg className={className} viewBox="0 0 36 30" aria-hidden="true"><path className="wing wing-left" d="M17 14C11 1 1 2 3 10c1 4 6 5 11 6-5 1-8 4-6 7 2 3 7 0 10-6Z"/><path className="wing wing-right" d="M19 14C25 1 35 2 33 10c-1 4-6 5-11 6 5 1 8 4 6 7-2 3-7 0-10-6Z"/><path d="M18 12v8m0-8-3-4m3 4 3-4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}

export function HeroButterflies() {
    return <div className="hero-butterflies" aria-hidden="true"><svg className="name-vine" viewBox="0 0 600 35" preserveAspectRatio="none"><path d="M12 27 C110 8 180 30 286 23 S460 10 588 23 M110 22c-5-8-11-8-14-9 3 7 7 10 14 9 M397 17c5-9 12-10 16-9-3 7-8 10-16 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg><Butterfly className="butterfly butterfly-one"/><Butterfly className="butterfly butterfly-two"/><Butterfly className="butterfly butterfly-three"/></div>;
}

export function CursorButterflies() {
    const one = useRef<HTMLDivElement>(null);
    const two = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
        if (!media.matches) return;
        let frame = 0, active = false;
        let target = { x: 0, y: 0 }, a = { x: 0, y: 0 }, b = { x: 0, y: 0 };
        const tick = () => {
            a.x += (target.x + 24 - a.x) * .09; a.y += (target.y - 18 - a.y) * .09;
            b.x += (target.x - 31 - b.x) * .055; b.y += (target.y + 24 - b.y) * .055;
            if (one.current) one.current.style.transform = `translate3d(${a.x}px, ${a.y}px, 0)`;
            if (two.current) two.current.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
            if (Math.abs(a.x-target.x-24)+Math.abs(a.y-target.y+18)+Math.abs(b.x-target.x+31)+Math.abs(b.y-target.y-24) > .5) frame = requestAnimationFrame(tick);
            else frame = 0;
        };
        const move = (e: PointerEvent) => {
            target = { x: e.clientX, y: e.clientY };
            if (!active) { a = { ...target }; b = { ...target }; active = true; if (one.current) one.current.style.opacity = '1'; if (two.current) two.current.style.opacity = '1'; }
            if (!frame) frame = requestAnimationFrame(tick);
        };
        const leave = () => { active = false; if (one.current) one.current.style.opacity = '0'; if (two.current) two.current.style.opacity = '0'; };
        window.addEventListener('pointermove', move); document.documentElement.addEventListener('pointerleave', leave);
        return () => { window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave); cancelAnimationFrame(frame); };
    }, []);
    return <div className="cursor-garden" aria-hidden="true"><div ref={one} className="cursor-butterfly"><Butterfly /></div><div ref={two} className="cursor-butterfly cursor-butterfly-two"><Butterfly /></div></div>;
}
