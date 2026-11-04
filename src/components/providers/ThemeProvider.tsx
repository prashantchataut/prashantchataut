'use client';
import { useEffect, useState } from 'react';
import PixelIcon from '@/components/pixel/PixelIcon';
export default function ThemeToggle() {
 const [theme,setTheme]=useState<'light'|'dark'>('light');
 useEffect(()=>{setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');},[]);
 function toggle(){const next=theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;localStorage.setItem('theme',next);setTheme(next);}
 return <button type="button" className="theme-toggle" onClick={toggle} aria-label={theme==='light'?'Switch to dark mode':'Switch to light mode'} title={theme==='light'?'Switch to dark mode':'Switch to light mode'}>{theme==='light'?<PixelIcon name="moon" size={2}/>:<PixelIcon name="sun" size={2}/>}<span className="theme-label">{theme==='light'?'Night':'Day'}</span></button>;
}
