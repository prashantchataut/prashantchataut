'use client';
import { useEffect, useRef } from 'react';
import { startMeadow, type Day } from './meadow-engine';
import { startHeroWings } from '@/components/wings/hero-wings';

/** Mounts the pixel meadow behind the hero text. The scene is decorative; the caption below it carries the data in words. */
export default function HeroScene({ days, textId }: { days: Day[] | null; textId: string }) {
    const root = useRef<HTMLDivElement>(null);
    const scene = useRef<HTMLCanvasElement>(null);
    const stitch = useRef<HTMLCanvasElement>(null);
    const wings = useRef<HTMLCanvasElement>(null);
    const tip = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!root.current || !scene.current || !stitch.current || !tip.current || !wings.current) return;
        const flock = startHeroWings(root.current, wings.current);
        const stop = startMeadow({
            root: root.current,
            scene: scene.current,
            stitch: stitch.current,
            tip: tip.current,
            text: document.getElementById(textId),
            days,
            onBlooms: flock.setBlooms,
        });
        root.current.dataset.ready = 'true';
        return () => {
            stop();
            flock.stop();
        };
    }, [days, textId]);

    return (
        <div ref={root} className="hero-scene" aria-hidden="true">
            <canvas ref={scene} className="hero-canvas" />
            <canvas ref={stitch} className="hero-stitch" />
            <canvas ref={wings} className="hero-wings" />
            <div ref={tip} className="meadow-tip" data-show="false" />
        </div>
    );
}
