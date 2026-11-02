'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

type Props = {
    children: ReactNode;
    delay?: number;
    className?: string;
    as?: ElementType;
};

export default function Reveal({ children, delay = 0, className, as: Tag = 'div' }: Props) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    el.setAttribute('data-visible', 'true');
                    observer.disconnect();
                }
            },
            { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            className={className ? `reveal ${className}` : 'reveal'}
            style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
        >
            {children}
        </Tag>
    );
}