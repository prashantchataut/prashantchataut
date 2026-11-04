'use client';
import { useEffect, useState } from 'react';
import PixelBed from '@/components/pixel/PixelBed';
const screens = [
 {name:'Home', image:'nebians-new-home', alt:'NEBians home feed with study materials and discussion posts'},
 {name:'Canvas', image:'nebians-new-canvas', alt:'NEBians canvas creation screen'},
 {name:'Create', image:'nebians-new-create', alt:'NEBians quick-create menu'},
 {name:'Syllabus', image:'nebians-new-syllabus', alt:'NEBians syllabus and subject library'},
 {name:'Lab', image:'nebians-new-lab', alt:'NEBians interactive chemistry lesson'}
];
export default function NebiansGallery(){const [active,setActive]=useState(0);useEffect(()=>{screens.forEach(s=>{const image=new Image();image.src=`/images/${s.image}.svg`;});},[]);const screen=screens[active];return <div className="project-visual nebians-visual nebians-gallery"><PixelBed kind="forget"/><div className="gallery-phone"><img src={`/images/${screen.image}.svg`} alt={screen.alt} width="420" height="933"/></div><div className="gallery-controls" aria-label="NEBians screenshots">{screens.map((s,i)=><button type="button" key={s.name} onClick={()=>setActive(i)} aria-pressed={active===i}>{s.name}</button>)}</div></div>}
