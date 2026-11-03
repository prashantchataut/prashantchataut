import { GardenName } from '@/components/garden/Butterflies';
export default function Hero() {
    return <section className="hero" aria-labelledby="hero-title"><div className="hero-inner"><div className="name-garden"><GardenName /></div><p className="hero-copy">I build apps, explore ideas, and write from Nepal.</p><div className="hero-actions"><a className="button button-dark" href="#work">Explore my work <span aria-hidden="true">↓</span></a><a className="text-link" href="/writes">Read my writing <span aria-hidden="true">↗</span></a></div><div className="hero-art" role="img" aria-label="An open window looks out over a path through terraced hills, beside a desk with a circuit board and a growing seedling" /></div></section>;
}
