import type { ReactNode } from 'react';

/**
 * A section label with an ASCII rule filling the rest of the row. The rule is
 * decorative and hidden from assistive tech.
 */
export default function SectionHead({
    label,
    note,
    children,
}: {
    label: string;
    note?: string;
    children?: ReactNode;
}) {
    return (
        <div className="flex items-center gap-5">
            <h2 className="shrink-0 font-mono text-[0.6rem] uppercase tracking-micro text-ink">
                {label}
            </h2>
            <span aria-hidden="true" className="h-px flex-1 bg-edge" />
            {note && (
                <span className="hidden shrink-0 font-mono text-[0.6rem] uppercase tracking-micro text-faint sm:block">
                    {note}
                </span>
            )}
            {children}
        </div>
    );
}