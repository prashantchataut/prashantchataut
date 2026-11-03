import Link from 'next/link';
import { compositions, writing } from '@/data/content';
import { formatDate } from '@/lib/format';
import Reveal from '@/components/ui/Reveal';
import SectionHead from '@/components/ui/SectionHead';

const PREVIEW_LINES = 6;

export default function Writing() {
    return (
        <section id="writing" className="relative scroll-mt-24 px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-[1240px]">
                <Reveal>
                    <SectionHead label="Compositions" note="poems and notes" />
                </Reveal>

                <Reveal delay={70}>
                    <div className="mt-14 grid gap-10 md:grid-cols-12">
                        <p className="max-w-[40ch] text-[1.02rem] leading-relaxed text-mist md:col-span-4">
                            {writing.blurb}
                        </p>

                        <div className="flex flex-col gap-6 md:col-span-7 md:col-start-6">
                            {compositions.slice(0, 2).map((piece) => (
                                <Link
                                    key={piece.slug}
                                    href={`/writes/${piece.slug}`}
                                    className="group flex items-baseline justify-between gap-6 border-t border-edge py-5 transition-colors duration-500 ease-glacial hover:border-glacier"
                                >
                                    <span className="flex flex-col gap-1.5">
                                        <span className="font-literary text-[1.35rem] font-light leading-tight tracking-tight text-ink transition-colors duration-300 ease-glacial group-hover:text-glacier">
                                            {piece.title}
                                        </span>
                                        <span className="font-mono text-[0.58rem] uppercase tracking-micro text-faint">
                                            {piece.kind} · {formatDate(piece.date)}
                                        </span>
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className="shrink-0 text-[1.05rem] leading-none text-faint transition-all duration-500 ease-glacial group-hover:translate-x-1 group-hover:text-glacier"
                                    >
                                        ↗
                                    </span>
                                </Link>
                            ))}

                            <Link
                                href="/writes"
                                className="group inline-flex items-baseline gap-3 self-start border-b border-ink pb-1 font-mono text-[0.66rem] uppercase tracking-micro text-ink transition-colors duration-300 ease-glacial hover:border-glacier hover:text-glacier"
                            >
                                Everything
                                <span
                                    aria-hidden="true"
                                    className="inline-block transition-transform duration-300 ease-glacial group-hover:translate-x-1"
                                >
                                    →
                                </span>
                            </Link>
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={140}>
                    <Link
                        href={`/writes/${compositions[0].slug}`}
                        className="group mt-20 block border border-edge p-8 transition-colors duration-500 ease-glacial hover:border-glacier sm:p-14"
                    >
                        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                            <span className="font-mono text-[0.58rem] uppercase tracking-micro text-faint">
                                {compositions[0].kind}
                            </span>
                            <time
                                dateTime={compositions[0].date}
                                className="font-mono text-[0.58rem] uppercase tracking-micro text-faint"
                            >
                                {formatDate(compositions[0].date)}
                            </time>
                        </div>

                        <h3 className="mt-8 font-literary text-[clamp(1.9rem,5vw,3.2rem)] font-light leading-[1.02] tracking-[-0.03em] text-ink transition-colors duration-500 ease-glacial group-hover:text-glacier">
                            {compositions[0].title}
                        </h3>

                        {compositions[0].note && (
                            <p className="mt-4 max-w-[44ch] font-literary text-[1.02rem] italic leading-relaxed text-mist">
                                {compositions[0].note}
                            </p>
                        )}

                        <div
                            className="mt-10 max-w-[46ch]"
                            style={{
                                maskImage: 'linear-gradient(to bottom, black 40%, transparent)',
                                WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent)',
                            }}
                        >
                            {(compositions[0].stanzas?.[0] ?? []).slice(0, PREVIEW_LINES).map((line) => (
                                <p
                                    key={line}
                                    className="font-literary text-[clamp(1rem,1.8vw,1.2rem)] font-light leading-[1.9] text-mist"
                                >
                                    {line}
                                </p>
                            ))}
                        </div>
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}