// Temporary preview fixture: no sessions, customer data or live actions are exposed.
import {notFound} from 'next/navigation';
import {AdminDashboard} from '../../../../../components/AdminDashboard';
export default async function Page({params}:{params:Promise<{locale:string}>}){if(process.env.VERCEL_ENV!=='preview')notFound();const {locale}=await params;if(locale!=='ar'&&locale!=='en')notFound();return <AdminDashboard ar={locale==='ar'}/>}
