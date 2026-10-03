import {notFound,redirect} from 'next/navigation';
import {currentAdmin} from '../../../../../lib/admin-auth';
import {AdminLogin} from '../../../../../components/AdminLogin';
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(locale!=='ar'&&locale!=='en')notFound();if(await currentAdmin())redirect(`/admin/${locale}/dashboard`);return <AdminLogin ar={locale==='ar'}/>}
