import Link from 'next/link';
import {notFound} from 'next/navigation';
import {Brand} from '../../components/Brand';
import {content,sections,Locale} from '../../content';
import '../globals.css';
export function generateStaticParams(){return [{locale:'en'},{locale:'ar'}];}
export async function generateMetadata({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(locale!=='en'&&locale!=='ar')return {};return {title:{default:'Indom Labs',template:'%s | Indom Labs'},description:content[locale].intro};}
export default async function Layout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;if(locale!=='ar'&&locale!=='en')notFound();const l=locale as Locale;const t=content[l];return <html lang={l} dir={l==='ar'?'rtl':'ltr'}><body><a className="skip" href="#main">{t.skip}</a><header><Link href={`/${l}`} className="navbrand"><Brand compact/></Link><nav aria-label={l==='ar'?'التنقل الرئيسي':'Main navigation'}>{['',...sections].map((s,i)=><Link key={s} href={`/${l}${s?'/'+s:''}`}>{t.nav[i]}</Link>)}</nav><LanguageLink locale={l}/><Link className="nav-cta" href={`/${l}/contact`}>{t.start} <span aria-hidden="true">↗</span></Link></header><main id="main">{children}</main><footer><div><Brand compact/><p>{t.footer}</p></div><div>{sections.map((s,i)=><Link key={s} href={`/${l}/${s}`}>{t.nav[i+1]}</Link>)}</div><p className="copyright">© 2026 {t.rights}</p></footer></body></html>}
import {LanguageLink} from '../../components/LanguageLink';
