'use server';
import {cookies,headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {authClient,adminCookie} from '../../../../lib/admin-auth';
import {createHash} from 'node:crypto';
const attempts=new Map<string,{count:number;until:number}>();
export async function login(_state:{error:string},form:FormData){
 const locale=form.get('locale')==='en'?'en':'ar',ar=locale==='ar';const failure={error:ar?'تعذر تسجيل الدخول. تحقق من بياناتك وحاول مجددًا.':'Unable to sign in. Check your credentials and try again.'};
 const email=form.get('email'),password=form.get('password');if(typeof email!=='string'||typeof password!=='string'||email.length>254||password.length>200)return failure;
 const h=await headers(),key=createHash('sha256').update(h.get('x-forwarded-for')||'local').digest('hex'),now=Date.now();for(const [k,v] of attempts)if(v.until<now)attempts.delete(k);const limit=attempts.get(key)||{count:0,until:now+60000};if(limit.count>=5)return {error:ar?'انتظر دقيقة قبل المحاولة مجددًا.':'Wait a minute before trying again.'};limit.count++;attempts.set(key,limit);
 let token='',expires=0;try{const {data,error}=await authClient().auth.signInWithPassword({email:email.trim().toLowerCase(),password});if(error||!data.session||data.user?.app_metadata.indom_admin!==true)return failure;token=data.session.access_token;expires=Math.min(data.session.expires_in,3600)}catch{return failure}
 (await cookies()).set(adminCookie,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/admin',maxAge:expires});redirect(`/admin/${locale}/dashboard`);
}
export async function logout(form:FormData){const locale=form.get('locale')==='en'?'en':'ar';(await cookies()).delete({name:adminCookie,path:'/admin'});redirect(`/admin/${locale}/login`)}
