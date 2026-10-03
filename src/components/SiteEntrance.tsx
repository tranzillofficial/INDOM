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
  const timer=setTimeout(finish,2000);
  motion.addEventListener('change',finish,{once:true});
  return()=>{clearTimeout(timer);document.body.style.overflow=previous;motion.removeEventListener('change',finish)};
 },[active]);
 return <>{active&&<div className="site-entrance" aria-hidden="true"><div className="entrance-space"><div className="entrance-brand"><svg viewBox="0 0 1170 340" className="kinetic-brand" aria-hidden="true">{paths.map((p,i)=><g key={p.id} className={`kinetic-letter kinetic-${p.id}`} style={{fill:i<2?'var(--brand-in)':'var(--brand-dom)'}}><path d={p.d} transform={p.transform} fillRule="evenodd"/></g>)}</svg><div className="entrance-credit" dir="ltr"><span>Powered by</span><AionMark/></div></div></div></div>}<div className={active?'site-content entrance-waiting':'site-content'} inert={active&&ready}>{children}</div><noscript><style>{'.site-entrance{display:none!important}.entrance-waiting{visibility:visible!important}'}</style></noscript></>;
}
