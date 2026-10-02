'use client';
import { useEffect, useState } from 'react';
import paths from '../logo-paths.json';

// Memory lasts for this document only: refresh/new visit starts a new intro.
let introPlayed = false;
export function Brand({ animated = false, compact = false }: { animated?: boolean; compact?: boolean }) {
  const [phase, setPhase] = useState<'pending' | 'animate' | 'static'>(animated ? 'pending' : 'static');
  useEffect(() => {
    if (!animated) return;
    const shouldPlay = !introPlayed;
    introPlayed = true;
    setPhase(shouldPlay ? 'animate' : 'static');
  }, [animated]);
  return <div className={compact ? 'brand compact' : 'brand'}>
    <svg viewBox={compact ? '0 0 1170 190' : '0 0 1170 340'} role="img" aria-label="Indom Labs"
      className={phase === 'animate' ? 'assembling' : phase === 'pending' ? 'brand-pending' : undefined}>
      {paths.filter(p => !compact || p.id !== 'signature').map((p, i) =>
        <g key={p.id} className={'letter letter-' + p.id}
          style={{ animationDelay: `${i < 5 ? i * .28 : 1.65}s`, fill: i < 2 ? 'var(--brand-in)' : 'var(--brand-dom)' }}>
          <path d={p.d} transform={p.transform} fillRule="evenodd" />
        </g>)}
    </svg>
  </div>;
}
