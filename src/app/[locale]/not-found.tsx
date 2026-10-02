'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
export default function NotFound(){const ar=usePathname().startsWith('/ar');return <section className="section page-heading"><p className="eyebrow">404</p><h1>{ar?'الصفحة مش موجودة.':'This page could not be found.'}</h1><p>{ar?'ممكن ترجع للرئيسية وتكمل من هناك.':'Return to the home page to continue exploring.'}</p><Link className="button" href={ar?'/ar':'/en'}>{ar?'ارجع للرئيسية':'Back to home'} ↗</Link></section>}
