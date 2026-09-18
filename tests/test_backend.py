import copy
import io
import json
import unittest
import uuid
from datetime import datetime,timezone
from backend.app import Application
from backend.domain import APIError,CONTRACTS,defaults,validate,day
from backend.store import Store,TABLES
from backend.resources import RESOURCES

class FakeAuth:
    url='https://example.supabase.co'; key='publishable'
    def __init__(self):self.calls=[];self.revoked=set()
    def call(self,method,path,body=None,token=None,query=None,headers=None):
        self.calls.append((method,path,body,token,query,headers))
        user={'id':'00000000-0000-4000-8000-000000000001','email':'user@example.com','user_metadata':{'name':'Anshul'}}
        if path=='/auth/v1/user':
            if token not in ('valid','other') or token in self.revoked:raise APIError(401,'Expired session')
            if token=='other':user['id']='00000000-0000-4000-8000-000000000002'
            return user
        if path=='/auth/v1/logout':self.revoked.add(token);return None
        if path=='/auth/v1/signup' and body['email']=='confirm@example.com':return {'user':user}
        return {'user':user,'access_token':'valid','refresh_token':'refresh','expires_in':3600}

class MemoryStore(Store):
    db={}
    def request(self,model,method,body=None,query=None,headers=None):
        query=query or {}; bucket=self.db.setdefault(model,{})
        records=[x for x in bucket.values() if x['user_id']==self.user_id]
        for field in ('id','version'):
            if field in query:records=[x for x in records if str(x[field])==str(query[field]).removeprefix('eq.')]
        if method=='GET':
            start=int(query.get('offset',0));return copy.deepcopy(records[start:start+int(query.get('limit',500))])
        if method=='POST':
            if body['id'] in bucket:raise APIError(409,'exists')
            row={**body,'version':1,'created_at':datetime.now(timezone.utc).isoformat(),'updated_at':datetime.now(timezone.utc).isoformat()}
            bucket[body['id']]=copy.deepcopy(row);return [row]
        if method=='PATCH':
            for x in records:x.update(copy.deepcopy(body))
            return copy.deepcopy(records)
        if method=='DELETE':
            for x in records:del bucket[x['id']]
            return None

class BackendTests(unittest.TestCase):
    def setUp(self):
        MemoryStore.db={};self.provider=FakeAuth();self.app=Application(self.provider,MemoryStore)
    def request(self,path,method='GET',body=None,token='valid',extra=None):
        raw=json.dumps(body).encode() if body is not None else b''
        env={'REQUEST_METHOD':method,'PATH_INFO':'/api/v1/'+path,'QUERY_STRING':'','wsgi.url_scheme':'https','HTTP_HOST':'app.example',
             'HTTP_ORIGIN':'https://app.example','HTTP_X_AUTOPILOT_CLIENT':'web','CONTENT_TYPE':'application/json','CONTENT_LENGTH':str(len(raw)),
             'HTTP_COOKIE':f'autopilot_access={token}; autopilot_refresh=refresh','wsgi.input':io.BytesIO(raw)}
        env.update(extra or {});result={}
        def start(status,headers):result.update(status=int(status.split()[0]),headers=headers)
        result['json']=json.loads(b''.join(self.app(env,start)));return result
    def test_vercel_rewrite_preserves_route_and_auth(self):
        extra={'PATH_INFO':'/api/index','QUERY_STRING':'_route=health'}
        self.assertEqual(self.request('',extra=extra)['status'],200)
        extra['QUERY_STRING']='_route=tasks'
        self.assertEqual(self.request('',token='',extra=extra)['status'],401)
        self.assertEqual(self.request('',extra=extra)['status'],200)
        self.assertEqual(self.request('tasks',token='',extra={'QUERY_STRING':'_route=health'})['status'],401)
    def test_auth_cookie_refresh_and_logout(self):
        response=self.request('auth/login','POST',{'email':'user@example.com','password':'password'},token='')
        self.assertEqual(response['status'],200)
        cookies=[v for k,v in response['headers'] if k=='Set-Cookie']
        self.assertEqual(len(cookies),2)
        for cookie in cookies:
            self.assertIn('HttpOnly',cookie);self.assertIn('Secure',cookie);self.assertIn('SameSite=Lax',cookie)
        self.assertNotIn('access_token',response['json']['data'])
        self.assertEqual(self.request('auth/me',token='expired')['status'],401)
        self.assertEqual(self.request('auth/refresh','POST',token='expired')['status'],200)
        self.assertEqual(self.request('auth/logout','POST')['status'],200)
        self.assertEqual(self.request('auth/me')['status'],401)
    def test_email_confirmation_explained(self):
        r=self.request('auth/register','POST',{'name':'Anshul','email':'confirm@example.com','password':'password'})
        self.assertEqual(r['status'],400);self.assertIn('confirm',r['json']['message'])
    def test_csrf_unauthenticated_and_method_protection(self):
        self.assertEqual(self.request('tasks',token='')['status'],401)
        self.assertEqual(self.request('tasks','POST',{'title':'X'},extra={'HTTP_ORIGIN':'https://evil.example'})['status'],403)
        self.assertEqual(self.request('tasks','POST',{'title':'X'},extra={'HTTP_X_AUTOPILOT_CLIENT':''})['status'],403)
        self.assertEqual(self.request('auth/login','GET')['status'],405)
        self.assertEqual(self.request('tasks','POST',[],extra={})['status'],400)
    def test_task_lifecycle_and_user_isolation(self):
        a=self.request('tasks','POST',{'title':'DSA','priority':'High'})
        self.assertEqual(a['status'],201,a)
        row=a['json']['data']['task'];identifier=row['id']
        self.assertEqual(row['_id'],identifier)
        self.assertEqual(self.request('tasks/'+identifier,token='other')['status'],404)
        self.assertEqual(self.request('tasks/'+identifier,'PUT',{'title':'steal'},token='other')['status'],404)
        self.assertEqual(self.request('tasks/'+identifier,'DELETE',token='other')['status'],404)
        self.assertEqual(self.request('tasks/'+identifier,'PUT',{'userId':'other'})['status'],400)
        b=self.request('tasks/'+identifier+'/complete','PATCH')['json']['data']['task']
        self.assertTrue(b['completed']);self.assertEqual(b['status'],'done');self.assertTrue(b['completedAt'])
        self.assertEqual(self.request('tasks/'+identifier,'DELETE')['status'],200)
        self.assertEqual(self.request('tasks')['json']['data']['tasks'],[])
    def test_empty_get_contracts_and_summaries(self):
        for prefix,(model,key,_,_) in RESOURCES.items():
            with self.subTest(path=prefix):
                r=self.request(prefix);self.assertEqual(r['status'],200,r)
                self.assertIsInstance(r['json']['data'][key] if key else r['json']['data'],list)
        for path in ('user/profile','user/preferences','health/profile','skills/profile','goals','goals/summary','coding/goals',
                     'dashboard/summary','analytics/summary','study/summary','coding/summary','migration/status'):
            with self.subTest(path=path):self.assertEqual(self.request(path)['status'],200,self.request(path))
        r=self.request('analytics/summary')['json']['data']
        self.assertEqual(r['coding']['problemsSolved'],0);self.assertEqual(r['tasks']['completionRate'],0)
    def test_preferences_merge_preserves_siblings(self):
        self.request('user/preferences','PUT',{'appearance':{'accentColor':'red'}})
        r=self.request('user/preferences')['json']['data']['preferences']
        self.assertEqual(r['appearance']['accentColor'],'red');self.assertIn('theme',r['appearance'])
    def test_daily_rewards_idempotent(self):
        for _ in range(2):r=self.request('skills/challenges/complete','POST',{'type':'code'})
        self.assertEqual(r['status'],200,r);self.assertEqual(r['json']['data']['profile']['xp'],100)
        self.assertEqual(r['json']['data']['reward']['xp'],0)
    def test_water_and_habits(self):
        for _ in range(2):r=self.request('health/water','POST',{'amount':1})
        self.assertEqual(r['status'],200,r);self.assertEqual(r['json']['data']['waterIntake'],2)
        r=self.request('health/habits','POST',{'title':'Reading','category':'Reading'})
        self.assertEqual(r['status'],200,r);identifier=r['json']['data']['habits'][0]['id']
        r=self.request('health/habits/'+identifier+'/toggle','PATCH',{})
        self.assertTrue(r['json']['data']['habits'][0]['history'][day()])
    def test_nested_project_ids_preserved(self):
        r=self.request('projects','POST',{'name':'AutoPilot','tasks':[{'id':42,'title':'Build','status':'done'}]})
        self.assertEqual(r['status'],201,r);self.assertEqual(r['json']['data']['project']['tasks'][0]['id'],42)
    def test_goals_and_summary_read_saved_records(self):
        self.request('coding/problems','POST',{'name':'Two Sum','status':'Solved','dateLogged':day()})
        r=self.request('coding/goals','POST',{'title':'Solve 5','targetCount':5,'period':'Weekly'})
        self.assertEqual(r['status'],200,r);self.assertEqual(r['json']['data']['goal']['currentCount'],1)
        self.assertEqual(self.request('dashboard/summary')['json']['data']['coding']['solvedProblems'],1)
    def test_notifications_queue_idempotent_and_isolated(self):
        r=self.request('notifications/queue','POST',{'title':'Study','message':'Start','scheduledFor':'2026-01-01T00:00:00Z'})
        self.assertEqual(r['status'],201,r)
        self.assertEqual(self.request('notifications/queue/process','POST',token='other')['json']['data']['processedCount'],0)
        for _ in range(2):self.request('notifications/queue/process','POST')
        self.assertEqual(len(self.request('notifications')['json']['data']),1)
    def test_validation_bounds(self):
        self.assertEqual(self.request('tasks','POST',{'title':''})['status'],400)
        self.assertEqual(self.request('health/water','POST',{'amount':float('nan')})['status'],400)
        self.assertEqual(self.request('health/sleep','POST',{'hours':25,'quality':90})['status'],400)
    def test_migration_deduplicates(self):
        body={'data':{'anshul_autopilot_tasks_data':json.dumps([{'title':'Legacy task'}])}}
        for _ in range(2):r=self.request('migration/import','POST',body)
        self.assertEqual(r['status'],200,r);self.assertEqual(len(self.request('tasks')['json']['data']['tasks']),1)
    def test_store_uses_user_token_owner_filter_and_table_allowlist(self):
        provider=FakeAuth()
        def capture(method,path,body=None,token=None,query=None,headers=None):
            self.assertEqual(token,'verified-jwt');self.assertEqual(query['user_id'],'eq.user-id')
            self.assertEqual(path,'/rest/v1/'+TABLES['Task']);return []
        provider.call=capture
        store=Store(provider,'verified-jwt','user-id');self.assertEqual(store.list('Task'),[])
        with self.assertRaises(APIError):store.list('auth.users')

if __name__=='__main__':unittest.main()
