import AgeInMotion from './AgeInMotion';
import Reveal from '@/components/ui/Reveal';
import SectionHead from '@/components/ui/SectionHead';

export default function Age() {
    return (
        <section id="age" className="relative scroll-mt-24 px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-[1240px]">
                <Reveal>
                    <SectionHead label="Time" note="counting in kathmandu" />
                </Reveal>
                <Reveal delay={80} className="mt-14">
                    <AgeInMotion />
                </Reveal>
            </div>
        </section>
    );
}