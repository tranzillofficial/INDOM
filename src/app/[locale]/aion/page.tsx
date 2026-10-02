import { redirect, notFound } from 'next/navigation';
export default async function Page({params}:{params:Promise<{locale:string}>}) { const {locale}=await params; if(locale!=='ar'&&locale!=='en')notFound(); redirect(`/${locale}?welcome=1`); }
