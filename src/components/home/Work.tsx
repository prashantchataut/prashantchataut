import { projects } from '@/data/content';
import Reveal from '@/components/ui/Reveal';
import SectionHead from '@/components/ui/SectionHead';

export default function Work() {
    return (
        <section id="work" className="relative scroll-mt-24 px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-[1240px]">
                <Reveal>
                    <SectionHead label="Work" note="three things, all still moving" />
                </Reveal>

                <div className="mt-16 flex flex-col">
                    {projects.map((p, i) => (
                        <Reveal key={p.id} delay={i * 80}>
                            <article className="grid gap-8 border-t border-edge py-12 md:grid-cols-12 md:py-16">
                                <div className="md:col-span-7">
                                    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                                        <h3 className="font-literary text-[clamp(1.9rem,4.4vw,3.1rem)] font-light leading-none tracking-tight text-ink">
                                            {p.name}
                                        </h3>
                                        <span className="font-mono text-[0.6rem] uppercase tracking-micro text-faint">
                                            {p.year}
                                        </span>
                                    </div>

                                    <p className="mt-6 max-w-[44ch] text-[1rem] leading-relaxed text-mist">
                                        {p.line}
                                    </p>

                                    <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-micro text-glacier">
                                        {p.status}
                                    </p>

                                    <ul className="mt-9 max-w-[52ch]">
                                        {p.points.map((point) => (
                                            <li
                                                key={point}
                                                className="flex gap-4 border-t border-edge-soft py-3 text-[0.9rem] leading-relaxed text-mist"
                                            >
                                                <span aria-hidden="true" className="text-glacier-pale">
                                                    ·
                                                </span>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3">
                                        {p.links.map((l) => (
                                            <a
                                                key={l.href}
                                                href={l.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group inline-flex items-baseline gap-2 font-mono text-[0.66rem] uppercase tracking-micro text-ink transition-colors duration-300 ease-glacial hover:text-glacier"
                                            >
                                                {l.label}
                                                <span
                                                    aria-hidden="true"
                                                    className="inline-block transition-transform duration-300 ease-glacial group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                                >
                                                    ↗
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {p.images.length > 0 && (
                                    <div className="md:col-span-4 md:col-start-9">
                                        <div className="grid grid-cols-3 gap-3 md:grid-cols-2">
                                            {p.images.slice(0, 4).map((img) => (
                                                <div
                                                    key={img.src}
                                                    className="group relative overflow-hidden border border-edge bg-ice"
                                                >
                                                    <img
                                                        src={img.src}
                                                        alt={img.alt}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="aspect-[4/5] w-full object-cover opacity-50 grayscale transition-[opacity,filter,transform] duration-700 ease-glacial group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </article>
                        </Reveal>
                    ))}
                    <hr className="hairline" />
                </div>
            </div>
        </section>
    );
}