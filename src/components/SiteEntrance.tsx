'use client';
import {useEffect,useState} from 'react';
import paths from '../logo-paths.json';
import {AionMark} from './AionMark';

// Document memory, deliberately reset by refresh or a new visit.
let entrancePlayed=false;
export function SiteEntrance({children}:{children:React.ReactNode}){
 const [active,setActive]=useState(()=>!entrancePlayed);
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  setReady(true);
  if(!active)return;
  entrancePlayed=true;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(motion.matches){setActive(false);return;}
  const previous=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const finish=()=>setActive(false);
  const timer=setTimeout(finish,4000);
  motion.addEventListener('change',finish,{once:true});
  return()=>{clearTimeout(timer);document.body.style.overflow=previous;motion.removeEventListener('change',finish)};
 },[active]);
 return <>{active&&<div className="site-entrance" aria-hidden="true"><svg className="entrance-speed-lines" viewBox="-800 -500 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="entrance-ray-gradient" x1="90" y1="0" x2="580" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="var(--brand-in)" stopOpacity="0"/><stop offset=".6" stopColor="var(--brand-in)" stopOpacity="1"/><stop offset="1" stopColor="var(--brand-in)" stopOpacity="0"/></linearGradient></defs>{Array.from({length:22},(_,i)=><line key={i} x1={90+(i%3)*28} y1="0" x2={400+(i%4)*60} y2="0" transform={`rotate(${i*360/22+7})`} stroke="url(#entrance-ray-gradient)"/>)}</svg><div className="entrance-space"><div className="entrance-brand"><svg viewBox="0 0 1170 340" className="kinetic-brand" aria-hidden="true">{paths.map((p,i)=><g key={p.id} className={`kinetic-letter kinetic-${p.id}`} style={{fill:i<2?'var(--brand-in)':'var(--brand-dom)'}}><path d={p.d} transform={p.transform} fillRule="evenodd"/></g>)}</svg><div className="entrance-credit" dir="ltr"><span>Powered by</span><AionMark/></div></div></div></div>}<div className={active?'site-content entrance-waiting':'site-content'} inert={active&&ready}>{children}</div><noscript><style>{'.site-entrance{display:none!important}.entrance-waiting{visibility:visible!important}'}</style></noscript></>;
}
