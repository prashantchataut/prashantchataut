'use client';
import { useEffect, useRef, useState } from 'react';

const ITEMS = [
    { id: 'nebians', name: 'NEBians', kind: 3, tone: 'iris' },
    { id: 'kairos', name: 'Kairos', kind: 1, tone: 'sun' },
    { id: 'retra', name: 'Retra', kind: 2, tone: 'rose' },
    { id: 'glamo', name: 'Glamo Nepal', kind: 0, tone: 'coral' },
] as const;

/** A quiet sticky guide through the work, with a hairline that fills as you scroll. */
export default function WorkRail() {
    const rail = useRef<HTMLElement>(null);
    const [active, setActive] = useState(-1);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const section = document.getElementById('work');
        if (!section) return;
        const articles = ITEMS.map((i) => document.getElementById(i.id));
        const update = () => {
            const r = section.getBoundingClientRect();
            const mid = innerHeight * 0.5;
            setProgress(Math.max(0, Math.min(1, (mid - r.top) / Math.max(1, r.height))));
            let current = -1;
            articles.forEach((a, i) => {
                if (a && a.getBoundingClientRect().top < mid) current = i;
            });
            setActive(current);
        };
        update();
        addEventListener('scroll', update, { passive: true });
        addEventListener('resize', update);
        return () => {
            removeEventListener('scroll', update);
            removeEventListener('resize', update);
        };
    }, []);

    return (
        <nav ref={rail} className="work-rail" aria-label="Projects">
            <ul>
                {ITEMS.map((item, i) => (
                    <li key={item.id}>
                        <a href={`#${item.id}`} data-tone={item.tone} data-reached={i <= active} aria-current={i === active ? 'location' : undefined}>
                            <span>{item.name}</span>
                        </a>
                    </li>
                ))}
            </ul>
            <div className="work-rail-vine" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></div>
        </nav>
    );
}
