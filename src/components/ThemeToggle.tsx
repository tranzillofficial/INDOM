'use client';
import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('indom-theme', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('indom-theme', callback);
    window.removeEventListener('storage', callback);
  };
}
const getTheme = () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
const serverTheme = () => 'light';
export function ThemeToggle({ ar }: { ar: boolean }) {
  const theme = useSyncExternalStore(subscribe, getTheme, serverTheme);
  const label = ar ? (theme === 'light' ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح') : (theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  function toggle() {
    const next = getTheme() === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('indom-theme', next); } catch {}
    window.dispatchEvent(new Event('indom-theme'));
  }
  return <button className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
    <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" /></svg>
    <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></svg>
  </button>;
}
