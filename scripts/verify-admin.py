"""HTTP authentication checks. Credentials stay in an external private JSON file."""
import json, sys, urllib.request, urllib.error, uuid
from html.parser import HTMLParser
class Inputs(HTMLParser):
 def __init__(self):super().__init__();self.fields=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='input' and a.get('type')=='hidden' and a.get('name'):self.fields.append((a['name'],a.get('value','')))
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*args):return None
base=sys.argv[1].rstrip('/');credentials=json.load(open(sys.argv[2]));opener=urllib.request.build_opener(NoRedirect)
def request(path,data=None,headers=None):
 try:
  r=opener.open(urllib.request.Request(base+path,data=data,headers=headers or {}),timeout=25)
 except urllib.error.HTTPError as e:r=e
 return r.code,r.headers,r.read().decode()
def form(fields):
 boundary='indom-'+uuid.uuid4().hex;body=''
 for name,value in fields:body+=f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n'
 return (body+f'--{boundary}--\r\n').encode(),{'Content-Type':'multipart/form-data; boundary='+boundary,'Origin':base}
status,headers,html=request('/admin/ar/dashboard');assert status in (303,307,308) and '/login' in headers['Location'];print('PASS: unauthenticated dashboard redirects to login')
for locale in ['ar','en']:
 status,_,html=request(f'/admin/{locale}/login');assert status==200 and f'lang="{locale}"' in html;print('PASS: '+locale+' login renders with correct language')
inputs=Inputs();inputs.feed(html)
body,h=form(inputs.fields+[('email',credentials['email']),('password','InvalidPassword!not-real')]);status,_,html=request('/admin/en/login',body,h);assert 'Unable to sign in' in html;print('PASS: incorrect password denied')
_,_,html=request('/admin/en/login');inputs=Inputs();inputs.feed(html)
body,h=form(inputs.fields+[('email',credentials['email']),('password',credentials['password'])]);status,headers,html=request('/admin/en/login',body,h);assert status==303 and headers['Location']=='/admin/en/dashboard',(status,'login did not redirect');cookie=headers.get('Set-Cookie','');assert 'HttpOnly' in cookie and 'Secure' in cookie and 'SameSite=lax' in cookie and 'Path=/admin' in cookie;print('PASS: correct password signs in with scoped secure HttpOnly cookie')
status,_,html=request('/admin/en/dashboard',headers={'Cookie':cookie.split(';')[0]});assert status==200 and 'UI PROTOTYPE' in html and 'MenuzQR' in html;print('PASS: authenticated dashboard renders prototype')
inputs=Inputs();inputs.feed(html);body,h=form(inputs.fields);h['Cookie']=cookie.split(';')[0];status,headers,_=request('/admin/en/dashboard',body,h);assert status==303 and '/login' in headers['Location'] and 'indom-admin-session=' in headers.get('Set-Cookie','');print('PASS: sign out clears the session cookie')
for locale in ['ar','en']:
 _,_,html=request('/'+locale+'/products');assert 'MenuzQR' in html and all(x not in html for x in ['Tranzill','Genaan','Engz']);print('PASS: '+locale+' products show MenuzQR only')
