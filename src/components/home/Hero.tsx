import { GardenName } from '@/components/garden/Butterflies';
export default function Hero() {
 return <section className="hero" aria-labelledby="hero-title"><div className="hero-inner"><p className="hero-kicker">DEVELOPER &amp; MAKER <span> / </span> NEPAL</p><div className="name-garden"><GardenName /></div><p className="hero-copy">I make apps to solve things that matter to me.</p><div className="hero-actions"><a className="button button-dark" href="#work">See my work <span aria-hidden="true">↓</span></a><a className="text-link" href="/writes">Read my writing <span aria-hidden="true">↗</span></a></div><div className="hero-field" aria-hidden="true"><pre className="ascii-illustration">{String.raw`        .      .             .        .
     .       .      \ | /       .
            .     --- * ---        .
      .                |        .
            .          |  /
                .  \  | /    .
                    \ |/
     .     .       __\|/__      .      .
              ____/   |   \____
      _______/________|_________\_______
       ~  ~   ~   ~   ~   ~   ~   ~`}</pre><span className="field-caption">PRASHANT / NEPAL</span></div></div></section>;
}
