import Link from 'next/link';
import { hero } from '@/data/content';
import Reveal from '@/components/ui/Reveal';

const MOUNTAIN_ART = [
    '        /\\_/\\            /\\_/\\            /\\_/\\      ',
    '       /     \\          /     \\          /     \\     ',
    '  /\\_/    /\\_/\\   /\\_/    /\\_/\\   /\\_/    /\\_/\\    ',
    ' /    \\__/     \\__/    \\__/     \\__/    \\__/     \\   ',
    '/______________/_______________________________/_______ ',
];

export default function Hero() {
    return (
        <section className="relative flex min-h-[100dvh] flex-col justify-between px-6 pb-12 pt-28 sm:pt-32">
            <div
                aria-hidden="true"
                className="lattice pointer-events-none absolute inset-0 opacity-30"
                style={{
                    maskImage: 'linear-gradient(to bottom, black 18%, transparent 58%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 18%, transparent 58%)',
                }}
            />

            <div className="relative mx-auto w-full max-w-[1240px]">
                <Reveal>
                    <p className="font-mono text-[0.6rem] uppercase tracking-micro text-faint">
                        {hero.phonetic} · nepal · est. 2009
                    </p>
                </Reveal>

                <Reveal delay={70}>
                    <h1 className="mt-7 max-w-[15ch] font-literary text-[clamp(3rem,10.5vw,8.5rem)] font-light leading-[0.92] tracking-[-0.04em] text-ink">
                        {hero.name}
                    </h1>
                </Reveal>

                <Reveal delay={140}>
                    <p
                        lang="ne"
                        className="mt-6 font-devanagari text-[clamp(1.15rem,3.2vw,2.1rem)] font-light leading-none text-glacier"
                    >
                        {hero.devanagari}
                    </p>
                </Reveal>
            </div>

            <div className="relative mx-auto mt-20 w-full max-w-[1240px]">
                <Reveal delay={210}>
                    <pre
                        aria-hidden="true"
                        className="mb-12 hidden overflow-x-auto whitespace-pre font-mono text-[0.58rem] leading-[1.5] text-faint sm:block"
                    >
                        {MOUNTAIN_ART.join('\n')}
                    </pre>
                </Reveal>

                <div className="grid gap-10 border-t border-edge pt-8 md:grid-cols-12">
                    <Reveal delay={260} className="md:col-span-5">
                        <p className="max-w-[42ch] text-[clamp(1rem,1.35vw,1.12rem)] leading-relaxed text-mist">
                            {hero.standfirst}
                        </p>
                    </Reveal>

                    <Reveal delay={330} className="md:col-span-4 md:col-start-9">
                        <div className="flex flex-col items-start gap-4">
                            {hero.actions.map((a) => (
                                <a
                                    key={a.label}
                                    href={a.href}
                                    {...(a.external
                                        ? { target: '_blank', rel: 'noopener noreferrer' }
                                        : {})}
                                    className="group inline-flex items-baseline gap-3 border-b border-ink pb-1 font-mono text-[0.68rem] uppercase tracking-micro text-ink transition-colors duration-300 ease-glacial hover:border-glacier hover:text-glacier"
                                >
                                    {a.label}
                                    <span
                                        aria-hidden="true"
                                        className="inline-block transition-transform duration-300 ease-glacial group-hover:translate-x-1 group-hover:-translate-y-0.5"
                                    >
                                        {a.external ? '↗' : '→'}
                                    </span>
                                </a>
                            ))}
                            <Link
                                href="/writes"
                                className="link-quiet font-mono text-[0.68rem] uppercase tracking-micro"
                            >
                                Read something
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}