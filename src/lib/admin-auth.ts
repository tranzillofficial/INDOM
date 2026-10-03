import 'server-only';
import {cookies} from 'next/headers';
import {createClient} from '@supabase/supabase-js';
import {supabaseUrl,supabasePublicKey} from './supabase-config';
export const adminCookie='indom-admin-session';
export function authClient(){return createClient(supabaseUrl,supabasePublicKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},global:{fetch:(input,init)=>fetch(input,{...init,cache:'no-store',signal:AbortSignal.timeout(10000)})}})}
export async function currentAdmin(){const token=(await cookies()).get(adminCookie)?.value;if(!token)return null;try{const {data,error}=await authClient().auth.getUser(token);return !error&&data.user?.app_metadata.indom_admin===true?data.user:null}catch{return null}}
