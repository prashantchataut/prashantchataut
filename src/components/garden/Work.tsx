import { Arrow, PixelFlower } from './icons';
import { projects, type Project } from './content';
import { img } from './assets';

function Media({ id }: { id: string }) {
  if (id === 'nebians')
    return <img className="gd-phone" src={img.nebians} width={420} height={933} alt="NEBians home feed with study materials and discussion posts" loading="lazy" />;
  if (id === 'kairos')
    return (
      <div className="gd-phones">
        <img className="gd-phone gd-phone--a" src={img.kairosWord} width={720} height={1548} alt="Kairos word detail screen" loading="lazy" />
        <img className="gd-phone gd-phone--b" src={img.kairosFeed} width={720} height={1548} alt="Kairos feed" loading="lazy" />
      </div>
    );
  if (id === 'retra')
    return <img className="gd-phone" src={img.retra} width={320} height={694} alt="Retra home screen featuring Mochi Hop" loading="lazy" />;
  return <img className="gd-wide" src={img.glamo} width={1100} height={749} alt="Glamo Nepal online storefront" loading="lazy" />;
}

function Pin({ p }: { p: Project }) {
  return (
    <article id={'work-' + p.id} className={'gd-pin gd-pin--' + p.id} style={{ ['--tone' as string]: p.color }}>
      <div className="gd-pin-media gd-box">
        <Media id={p.id} />
        <PixelFlower kind={p.species} h={15} scale={3} className="gd-pin-sticker" />
      </div>
      <div className="gd-pin-body">
        <p className="gd-pin-kind">{p.kind}</p>
        <h3>{p.name}</h3>
        <p>{p.blurb}</p>
        <p className="gd-soft">{p.detail}</p>
        <ul className="gd-tags" aria-label="Built with">
          {p.stack.map((s) => <li key={s}>{s}</li>)}
        </ul>
        <div className="gd-pin-links">
          <a className="gd-btn gd-pin-main" href={p.primary.href} target="_blank" rel="noopener noreferrer">{p.primary.label} <Arrow /></a>
          {p.secondary && <a className="gd-textlink" href={p.secondary.href} target="_blank" rel="noopener noreferrer">{p.secondary.label} <Arrow /></a>}
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  return (
    <section id="work" className="gd-section gd-work" aria-labelledby="work-title">
      <div className="gd-head">
        <h2 id="work-title" className="gd-h2">Made to be used.</h2>
        <p className="gd-lede">Four projects, four different problems.</p>
      </div>
      <div className="gd-board">
        {projects.map((p) => <Pin key={p.id} p={p} />)}
      </div>
    </section>
  );
}
