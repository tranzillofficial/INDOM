import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Brand } from '../../components/Brand';
import { Navigation } from '../../components/Navigation';
import { LanguageLink } from '../../components/LanguageLink';
import { ThemeToggle } from '../../components/ThemeToggle';
import { content, sections, type Locale } from '../../content';
import '../globals.css';

export const viewport = { width: 'device-width', initialScale: 1 };
export function generateStaticParams() { return [{ locale: 'en' }, { locale: 'ar' }]; }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'ar') return {};
  return { title: { default: 'Indom Labs', template: '%s | Indom Labs' }, description: content[locale].intro };
}
const themeScript = `(function(){var t='light';try{if(localStorage.getItem('indom-theme')==='dark')t='dark'}catch(e){}document.documentElement.dataset.theme=t})()`;
export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'ar' && locale !== 'en') notFound();
  const l = locale as Locale; const t = content[l];
  return <html lang={l} dir={l === 'ar' ? 'rtl' : 'ltr'} data-theme="light" suppressHydrationWarning>
    <body>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <a className="skip" href="#main">{t.skip}</a>
      <header className="site-header"><div className="header-inner">
        <Link href={`/${l}`} className="navbrand" aria-label="Indom Labs"><Brand compact /><span>LABS</span></Link>
        <Navigation locale={l} />
        <div className="header-tools"><LanguageLink locale={l} /><ThemeToggle ar={l === 'ar'} /><Link className="nav-cta" href={`/${l}/contact`}>{t.start}<span aria-hidden="true">↗</span></Link></div>
      </div></header>
      <main id="main">{children}</main>
      <footer><div><Link href={`/${l}`} className="footer-brand"><Brand compact /><span>LABS</span></Link><p>{t.footer}</p></div>
        <div className="footer-links">{sections.map((s, i) => <Link key={s} href={`/${l}/${s}`}>{t.nav[i + 1]}</Link>)}</div>
        <p className="copyright">© 2026 {t.rights}</p>
      </footer>
    </body>
  </html>;
}
