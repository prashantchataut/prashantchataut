'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import FlowerArt from '@/components/floral/FlowerArt';

/** A flower that opens when its project scrolls into view and spins a little when touched. */
export function ProjectBloom({ kind, index }: { kind: number; index: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setOpen(e.isIntersecting), { threshold: 0.4 });
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return (
        <div ref={ref} className="project-bloom" data-open={open} aria-hidden="true">
            <svg viewBox="-13 -13 26 26" width="24" height="24" focusable="false">
                <g className="project-bloom-flower"><FlowerArt kind={kind} r={10} /></g>
            </svg>
            <span>{index}</span>
        </div>
    );
}

/** Gives the screenshots a little parallax so the phones drift against the pointer. Fine pointers only. */
export function Stage({ className, children }: { className: string; children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el || !matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
        const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            el.style.setProperty('--tx', String(((e.clientX - r.left) / r.width - 0.5) * 2));
            el.style.setProperty('--ty', String(((e.clientY - r.top) / r.height - 0.5) * 2));
        };
        const leave = () => { el.style.setProperty('--tx', '0'); el.style.setProperty('--ty', '0'); };
        el.addEventListener('pointermove', move, { passive: true });
        el.addEventListener('pointerleave', leave);
        return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
    }, []);
    return <div ref={ref} className={className}>{children}</div>;
}
