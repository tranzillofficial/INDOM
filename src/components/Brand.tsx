'use client';
import { useState } from 'react';
import paths from '../logo-paths.json';
export function Brand({ animated=false, replayLabel='', compact=false }: {animated?:boolean;replayLabel?:string;compact?:boolean}) {
 const [run,setRun]=useState(0);
 return <div className={compact?'brand compact':'brand'}>
  <svg key={run} viewBox={compact?'0 0 1170 190':'0 0 1170 340'} role="img" aria-label="Indom Labs" className={animated?'assembling':''}>
   {paths.filter(p=>!compact||p.id!=='signature').map((p,i)=><g key={p.id} className={'letter letter-'+p.id} style={{animationDelay:`${i<5?i*.38:2.2}s`,fill:i<2?'var(--brand-in)':'var(--brand-dom)'}}><path d={p.d} transform={p.transform} fillRule="evenodd"/></g>)}
  </svg>
  {animated&&<button className="replay" onClick={()=>setRun(v=>v+1)}><span aria-hidden="true">↻</span> {replayLabel}</button>}
 </div>;
}
