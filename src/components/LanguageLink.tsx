'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
export function LanguageLink({locale}:{locale:string}){const path=usePathname();const target=locale==='ar'?'en':'ar';return <Link className="language" href={path.replace(/^\/(ar|en)(?=\/|$)/,`/${target}`)} lang={target} aria-label={locale==='ar'?'Switch to English':'التبديل للعربية'}>{locale==='ar'?'EN':'عربي'}</Link>}
