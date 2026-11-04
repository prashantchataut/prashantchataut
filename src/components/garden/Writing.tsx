import { Arrow, PixelFlower } from './icons';
import { writing } from './content';

export default function Writing() {
  return (
    <section id="writing" className="gd-section gd-writing" aria-labelledby="writing-title">
      <div className="gd-head">
        <h2 id="writing-title" className="gd-h2">Writing.</h2>
        <p className="gd-lede">Poems and notes on making things.</p>
      </div>
      <ul className="gd-notes">
        {writing.map((w) => (
          <li key={w.title}>
            <a className="gd-note gd-box" href={w.href}>
              <span className="gd-stamp" aria-hidden="true"><PixelFlower kind={w.flower} h={9} scale={3} /></span>
              <span className="gd-note-kind">{w.kind}</span>
              <span className="gd-note-title">{w.title}</span>
              <span className="gd-note-go">Read it <Arrow /></span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
