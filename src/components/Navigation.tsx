'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { content, sections, type Locale } from '../content';

export function Navigation({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [expandedPath, setExpandedPath] = useState<string | null>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const open = expandedPath === pathname;
  const ar = locale === 'ar';

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpandedPath(null);
        toggle.current?.focus();
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);

  return <div className="navigation">
    <button ref={toggle} className="menu-toggle" aria-expanded={open}
      aria-controls="primary-navigation" onClick={() => setExpandedPath(open ? null : pathname)}>
      <span aria-hidden="true">{open ? '×' : '☰'}</span>
      {ar ? (open ? 'إغلاق' : 'القائمة') : (open ? 'Close' : 'Menu')}
    </button>
    <nav id="primary-navigation" className={open ? 'is-open' : ''}
      aria-label={ar ? 'التنقل الرئيسي' : 'Main navigation'}>
      {['', ...sections].map((section, index) => {
        const href = `/${locale}${section ? '/' + section : ''}`;
        return <Link key={section} href={href} aria-current={pathname === href ? 'page' : undefined}
          onClick={() => setExpandedPath(null)}>{content[locale].nav[index]}</Link>;
      })}
    </nav>
  </div>;
}
