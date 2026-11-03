'use client';
import { useEffect, useRef } from 'react';
type Particle = {x:number;y:number;vx:number;vy:number;size:number;phase:number;angle:number;spin:number;line:number|null;offset:number;until:number};
export default function ReadingAtmosphere({theme}:{theme:string}) {
 const canvas=useRef<HTMLCanvasElement>(null); const bar=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const progress=()=>{const total=document.documentElement.scrollHeight-innerHeight;if(bar.current)bar.current.style.transform=`scaleX(${total>0?Math.min(1,scrollY/total):0})`;};
  window.addEventListener('scroll',progress,{passive:true});progress();
  const c=canvas.current,ctx=c?.getContext('2d');if(!c||!ctx||matchMedia('(prefers-reduced-motion: reduce)').matches)return()=>window.removeEventListener('scroll',progress);
  let width=0,height=0,raf=0,last=0,lines:DOMRect[]=[],gust=0,mouseX=0;
  const particles:Particle[]=[];const limit=theme==='grace'?19:15;
  const measure=()=>{lines=[];document.querySelectorAll('.reading-passage p').forEach(p=>{const range=document.createRange();range.selectNodeContents(p);lines.push(...Array.from(range.getClientRects()).filter(r=>r.width>8&&r.height>2));});};
  const resize=()=>{width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);c.width=width*dpr;c.height=height*dpr;c.style.width=width+'px';c.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);measure();};
  const spawn=(initial=false):Particle=>({x:Math.random()*width,y:initial?Math.random()*height:-12,vx:(Math.random()-.2)*13,vy:20+Math.random()*25,size:4+Math.random()*5,phase:Math.random()*6.28,angle:Math.random()*6.28,spin:(Math.random()-.5)*1.4,line:null,offset:0,until:0});
  const draw=(t:number)=>{if(document.hidden){last=t;raf=requestAnimationFrame(draw);return;}const dt=Math.min((t-(last||t))/1000,.04);last=t;ctx.clearRect(0,0,width,height);gust*=.985;
   for(let i=0;i<particles.length;i++){const p=particles[i];if(p.line!==null){const r=lines[p.line];if(!r||t>p.until){p.line=null;p.y+=2;p.vx+=10;}else{p.x=r.left+p.offset;p.y=r.top-2;}}
    if(p.line===null){const old=p.y;p.phase+=dt;p.x+=(p.vx+Math.sin(p.phase*1.7)*13+gust)*dt;p.y+=p.vy*dt;p.angle+=p.spin*dt;
     if(theme==='grace'){for(let j=0;j<lines.length;j++){const r=lines[j];if(r.top>0&&r.top<height&&old+p.size/2<=r.top&&p.y+p.size/2>=r.top&&p.x>r.left&&p.x<r.right){p.line=j;p.offset=p.x-r.left;p.y=r.top-p.size/2;p.until=t+1800+Math.random()*2500;break;}}}}
    if(p.y>height+25||p.x>width+35||p.x< -35){particles[i]=spawn();continue;}
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);if(theme==='grace'){ctx.fillStyle=document.documentElement.dataset.theme==='dark'?'rgba(239,174,167,.72)':'rgba(177,71,83,.55)';ctx.beginPath();ctx.moveTo(0,-p.size);ctx.bezierCurveTo(p.size,-p.size,p.size,p.size*.65,0,p.size);ctx.bezierCurveTo(-p.size*.65,p.size*.45,-p.size*.7,-p.size*.6,0,-p.size);ctx.fill();}else{ctx.strokeStyle=document.documentElement.dataset.theme==='dark'?'rgba(174,203,170,.55)':'rgba(57,111,103,.42)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-p.size*1.6,0);ctx.quadraticCurveTo(0,-p.size,p.size*1.6,0);ctx.stroke();}ctx.restore();}
   c.dataset.stuckCount=String(particles.filter(p=>p.line!==null).length);raf=requestAnimationFrame(draw);};
  const scroll=()=>{measure();};const move=(e:PointerEvent)=>{gust=Math.max(-25,Math.min(25,(e.clientX-mouseX)*.9));mouseX=e.clientX;};
  resize();for(let i=0;i<limit;i++)particles.push(spawn(true));window.addEventListener('resize',resize);window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('pointermove',move,{passive:true});raf=requestAnimationFrame(draw);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',progress);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move);};
 },[theme]);
 return <><canvas ref={canvas} className="reading-atmosphere" aria-hidden="true"/><div className="reading-progress" aria-hidden="true"><div ref={bar}/></div></>;
}
