import HeroScene from '@/components/hero/HeroScene';
import PixelIcon from '@/components/pixel/PixelIcon';
import PixelSprite from '@/components/pixel/PixelSprite';
import { LEGEND, PLANTS } from '@/components/pixel/sprites';
import { getContributions } from '@/lib/github';

export default async function Hero() {
 const data = await getContributions();
 return <section className="hero" aria-labelledby="hero-title">
  <div className="hero-sky">
   <HeroScene days={data?.days ?? null} textId="hero-text" />
   <div id="hero-text" className="hero-text">
    <h1 id="hero-title">Prashant Chataut</h1>
    <p className="hero-copy">Developer from Nepal. I make apps to solve things that matter to me.</p>
    <div className="hero-actions"><a className="button button-dark" href="#work">See my work <PixelIcon name="down" /></a><a className="text-link" href="/writes">Read my writing <PixelIcon name="right" /></a></div>
   </div>
  </div>
  {data && <div className="meadow-key"><p>Each plant is a day of my past year on <a href="https://github.com/prashantchataut">GitHub</a>: {data.total.toLocaleString('en-US')} contributions.</p><ul className="meadow-legend" aria-label="Contributions in a day">{LEGEND.map(({kind,label})=><li key={kind}><PixelSprite sprite={PLANTS[kind][0]} scale={3}/><span>{label}</span></li>)}</ul></div>}
 </section>;
}
