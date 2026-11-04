import PixelSprite from './PixelSprite';
import { BEDS } from './sprites';

/** A small repeating border, kept behind the project screenshots. */
export default function PixelBed({ kind }: { kind: 'forget' | 'dandelion' | 'sunflower' | 'rose' }) {
 const sprites = BEDS[kind];
 return <div className="pixel-bed" aria-hidden="true">{Array.from({length: 18}, (_, i) => <span key={i}><PixelSprite sprite={sprites[i % sprites.length]} scale={3} mirror={i % 3 === 0} /></span>)}</div>;
}
