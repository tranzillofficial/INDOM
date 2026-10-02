import { ServicePaths } from '../../components/ServicePaths';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Brand } from '../../components/Brand';
import { content, type Locale } from '../../content';

const serviceIcons = [
  <path key="web" d="M4 5h16v14H4zM4 9h16M7 7h.01M10 7h.01M9 12l-2 2 2 2m6-4 2 2-2 2" />,
  <path key="app" d="M7 3h10v18H7zM10 18h4M9 6h6" />,
  <path key="ai" d="M9 3h6v4H9zM5 9h14v10H5zM9 13h.01M15 13h.01M9 16h6M2 12v4m20-4v4" />,
  <path key="design" d="m4 17 9-9 3 3-9 9H4zM13 8l3-3 3 3-3 3M5 4v5M2.5 6.5h5M19 16v5m-2.5-2.5h5" />,
  <path key="marketing" d="m4 10 12-5v14L4 14zM16 9h4v6h-4M6 15l2 6h4l-2-5" />,
  <path key="strategy" d="M4 19h16M7 16v-4m5 4V8m5 8V4M5 7l5-3 4 2 5-4" />,
];
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'ar' && locale !== 'en') notFound();
  const t = content[locale as Locale];
  return <>
    <section className="hero">
      <div className="hero-content"><p className="eyebrow"><span className="status-dot" />{t.studio}</p>
        <h1>{t.headline[0]}<br /><em>{t.headline[1]}</em></h1><p className="intro">{t.intro}</p>
        <div className="actions"><Link className="button" href={`/${locale}/contact`}>{t.start}<span aria-hidden="true">↗</span></Link><Link className="textlink" href="#services">{t.explore}<span aria-hidden="true">↓</span></Link></div>
      </div>
      <div className="hero-brand"><Brand animated /><p className="slogan">{t.slogan}</p></div>
      <div className="hero-bottom"><span>{t.footer}</span><Link href={`/${locale}/about`}>{t.aboutLink}<span aria-hidden="true">↗</span></Link></div>
    </section>
    <section id="services" className="section capabilities"><div className="section-heading"><div><p className="eyebrow">{t.capability}</p><h2>{t.serviceTitle}</h2></div><Link className="textlink" href={`/${locale}/services`}>{t.allServices}<span aria-hidden="true">↗</span></Link></div>
      <ServicePaths ar={locale === "ar"} />
    </section>
    <section className="section process"><div className="section-heading"><div><p className="eyebrow">{t.processLabel}</p><h2>{t.processTitle}</h2></div><p>{t.processIntro}</p></div>
      <div className="steps">{t.steps.map(([title, desc], i) => <div key={title}><span className="step-index">0{i + 1}</span><h3>{title}</h3><p>{desc}</p></div>)}</div>
    </section>
    <section className="section cta"><div><p className="eyebrow">INDOM LABS</p><h2>{t.cta}</h2><p>{t.ctaText}</p></div><Link className="button" href={`/${locale}/contact`}>{t.start}<span aria-hidden="true">↗</span></Link></section>
  </>;
}
