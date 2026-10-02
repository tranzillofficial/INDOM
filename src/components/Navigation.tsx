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
      aria-controls="primary-navigation" aria-label={ar ? (open ? 'إغلاق القائمة' : 'فتح القائمة') : (open ? 'Close menu' : 'Open menu')} onClick={() => setExpandedPath(open ? null : pathname)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{open ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 8h16M4 16h16" />}</svg>
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
