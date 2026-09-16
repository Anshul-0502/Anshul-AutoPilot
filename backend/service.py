"""Application services for the existing AutoPilot modules."""
import json
from datetime import datetime, timezone, timedelta
from .domain import APIError, validate, defaults, CONTRACTS, day, now, number, merge, streak
from .resources import RESOURCES

class Service:
    def __init__(self, store, user):
        self.store, self.user = store, user

    def dispatch(self, method, path, body, query):
        if path in ('user/profile', 'user/preferences'):
            model, key = ('UserProfile','profile') if path.endswith('profile') else ('UserPreferences','preferences')
            old = self.store.singleton(model, {'fullName':self.user['name'], 'username':self.user['email'].split('@')[0]} if key == 'profile' else None)
            if method == 'PUT':
                old = self.store.update(model, old['id'], lambda x: validate(model, body, x))
            elif method != 'GET':
                raise APIError(405, 'Method not allowed.')
            return {key:old}, 200
        if path == 'health/focus-sessions' and method == 'POST':
            from uuid import UUID, uuid4
            try: request_id = str(UUID(body.get('_request_id') or str(uuid4())))
            except ValueError: raise APIError(400, 'Invalid idempotency key.')
            record = validate('FocusSession', body)
            self.store.singleton('SkillProfile')
            return self.store.provider.call('POST', '/rest/v1/rpc/ap_complete_focus', {
                'p_type': record['type'], 'p_duration': number(record['duration'],1,1440),
                'p_date': day(record['date']), 'p_request_id': request_id
            }, token=self.store.token), 201
        if path.startswith('health/') and path != 'health/focus-sessions':
            return self.health(method, path, body, query), 200
        if path.startswith('skills/'):
            return self.skills(method, path, body), 200
        if path.startswith('goals') or path.startswith('coding/goals'):
            return self.goals(method, path, body), 200
        if path in ('dashboard/summary','analytics/summary','coding/summary','study/summary'):
            if method != 'GET':
                raise APIError(405, 'Method not allowed.')
            from .summaries import summarize
            return summarize(self, path, query), 200
        if path.startswith('migration/'):
            return self.migration(method, path, body), 200
        if path == 'notifications/queue/process' and method == 'POST':
            # Processing is scoped to the current authenticated user; no global worker privileges.
            return self.process_queue(), 200
        if path in ('notifications/read-all', 'notifications/clear-all'):
            if method == 'DELETE' and path.endswith('clear-all'):
                self.store.clear('Notification')
            elif method == 'PATCH' and path.endswith('read-all'):
                for row in self.store.list('Notification'):
                    self.store.update('Notification', row['id'], lambda x: {**x,'read':True})
            else:
                raise APIError(405, 'Method not allowed.')
            return {},200
        if path.startswith('tasks/') and path.endswith('/complete') and method == 'PATCH':
            item = self.store.update('Task', path.split('/')[1], lambda x: validate('Task', {'completed':not x.get('completed',False)}, x))
            return {'task':item},200
        if path.startswith('notifications/') and path.endswith('/read') and method == 'PATCH':
            return self.store.update('Notification', path.split('/')[1], lambda x: {**x,'read':True}),200
        for prefix, (model, list_key, item_key, operations) in sorted(RESOURCES.items(), key=lambda x:-len(x[0])):
            if path != prefix and not path.startswith(prefix + '/'):
                continue
            identifier = path[len(prefix):].strip('/')
            if '/' in identifier:
                continue
            pack = lambda key,value: {key:value} if key else value
            if method == 'GET' and 'G' in operations:
                data = self.store.get(model,identifier) if identifier else self.store.list(model)
                return pack(item_key if identifier else list_key,data),200
            if method == 'POST' and not identifier and 'C' in operations:
                data = validate(model, body)
                if model == 'FocusSession':
                    data.update(rewardProcessed=False,xpAwarded=0,coinsAwarded=0)
                # Chat history preserves its chronological display order through the client adapter.
                return pack(item_key,self.store.create(model,data)),201
            if method in ('PUT','PATCH') and identifier and 'U' in operations:
                if model == 'NotificationQueue':
                    raise APIError(405,'Queue jobs cannot be edited. Delete and recreate the job.')
                return pack(item_key,self.store.update(model,identifier,lambda x:validate(model,body,x))),200
            if method == 'DELETE':
                if identifier and 'D' in operations:
                    self.store.delete(model,identifier)
                    return {'id':identifier},200
                if not identifier and 'X' in operations:
                    self.store.clear(model)
                    return {},200
            raise APIError(405, 'Method not allowed.')
        raise APIError(404, 'API route not found.')

    def health_data(self, date):
        profile = self.store.singleton('HealthProfile')
        water = self.store.dated('WaterLog',date,{'goal':profile['waterGoal']})
        meditations = self.store.list('MeditationSession')
        history = {}
        for row in meditations:
            history[row['date']] = history.get(row['date'],0) + row['duration']
        return {**profile, 'waterIntake':water.get('intake',0),'sleepHistory':self.store.list('SleepLog'),
                'workouts':self.store.list('Workout'),'meditationTime':sum(history.values()),
                'meditationHistory':[{'date':d,'duration':n} for d,n in sorted(history.items())],
                'habits':self.store.list('Habit')}

    def health(self, method, path, body, query):
        date = day(body.get('today') or query.get('today'))
        if path == 'health/profile' and method == 'GET':
            return self.health_data(date)
        profile = self.store.singleton('HealthProfile')
        if path == 'health/water' and method == 'POST':
            delta = number(body.get('amount'),-100,100)
            water = self.store.dated('WaterLog', date, {'goal':profile['waterGoal']})
            self.store.update('WaterLog',water['id'],lambda x:{**x,'intake':max(0,min(100,x.get('intake',0)+delta))})
        elif path == 'health/water/goal' and method == 'PUT':
            goal = number(body.get('goal'),1,100)
            self.store.update('HealthProfile',profile['id'],lambda x:{**x,'waterGoal':goal})
            water = self.store.dated('WaterLog',date,{'goal':goal})
            self.store.update('WaterLog',water['id'],lambda x:{**x,'goal':goal})
        elif path == 'health/workouts' and method == 'POST':
            self.store.create('Workout',validate('Workout',{**body,'date':date,'status':'Completed'}))
        elif path == 'health/sleep' and method == 'POST':
            hours,quality = number(body.get('hours'),0,24),number(body.get('quality'),0,100)
            self.store.update('HealthProfile',profile['id'],lambda x:{**x,'sleepTime':body.get('sleepTime','23:00'),'wakeTime':body.get('wakeTime','07:00'),'sleepQuality':quality})
            sleep = self.store.dated('SleepLog',date)
            self.store.update('SleepLog',sleep['id'],lambda x:{**x,'hours':hours,'day':datetime.fromisoformat(date).strftime('%a')})
        elif path == 'health/meditation' and method == 'POST':
            self.store.create('MeditationSession',validate('MeditationSession',{'date':date,'duration':number(body.get('duration'),1,1440)}))
        elif path == 'health/habits' and method == 'POST':
            self.store.create('Habit',validate('Habit',{**body,'streak':0,'history':{}}))
        elif path.startswith('health/habits/') and path.endswith('/toggle') and method == 'PATCH':
            identifier = path.split('/')[2]
            def toggle(x):
                h = {**x.get('history',{}),date:not x.get('history',{}).get(date,False)}
                return {**x,'history':h,'streak':streak([d for d,v in h.items() if v])}
            self.store.update('Habit',identifier,toggle)
        elif path == 'health/reminders' and method == 'PATCH':
            key = body.get('key')
            if key not in profile.get('reminders',{}):
                raise APIError(400,'Invalid reminder.')
            self.store.update('HealthProfile',profile['id'],lambda x:{**x,'reminders':{**x['reminders'],key:not x['reminders'][key]}})
        else:
            raise APIError(404,'Health route not found.')
        return self.health_data(date)

    def skills(self, method, path, body):
        profile = self.store.singleton('SkillProfile')
        date = day()  # Daily rewards use server date, never a client-controlled future date.
        reward = {'xp':0,'coins':0}
        def change(x):
            nonlocal reward
            reward = {'xp':0,'coins':0}
            if x.get('lastActiveDate') != date:
                if x.get('lastActiveDate') and (datetime.fromisoformat(date)-datetime.fromisoformat(day(x['lastActiveDate']))).days > 1:
                    x['streak'] = 0
                x['lastActiveDate'],x['completedChallenges'] = date,[]
            if method == 'GET' and path == 'skills/profile':
                return x
            if method != 'POST':
                raise APIError(405,'Method not allowed.')
            if path == 'skills/challenges/complete':
                typ = body.get('type')
                rewards = {'code':(100,20),'quiz':(80,15),'logic':(90,15),'brain':(80,15)}
                if typ not in rewards:
                    raise APIError(400,'Unknown challenge.')
                if typ not in x['completedChallenges']:
                    x['completedChallenges'].append(typ)
                    reward = dict(zip(('xp','coins'),rewards[typ]))
                    if len(x['completedChallenges']) == 1:
                        x['streak'] += 1
                    if len(x['completedChallenges']) == 4:
                        reward['xp'] += 100
                        reward['coins'] += 50
            elif path == 'skills/activities':
                category = body.get('category')
                if category not in ('code','quiz','logic','brain','reaction','math','memory','binary'):
                    raise APIError(400,'Unknown activity category.')
                stats = x['stats']
                stats['totalGames'] += 1
                if category == 'code': stats['codingCompleted'] += 1
                if category == 'quiz': stats['quizzesCompleted'] += 1
                if 'isCorrect' in body:
                    if not isinstance(body['isCorrect'],bool):raise APIError(400,'isCorrect must be boolean.')
                    stats['totalAttempts'] += 1
                    stats['correctAttempts'] += int(body['isCorrect'])
                    stats['accuracy'] = round(stats['correctAttempts']/stats['totalAttempts']*100)
                if 'score' in body:stats['logicScore'] = number(body['score'],0,100000)
                if 'reactionTime' in body:stats['reactionTime'] = number(body['reactionTime'],0,100000)
                # Personal practice rewards; no client-controlled arbitrary XP amount.
                reward = {'xp':20 if body.get('isCorrect',True) else 5,'coins':5 if body.get('isCorrect',True) else 0}
            elif path == 'skills/missions/complete':
                key,node = body.get('pathKey'),body.get('nodeKey')
                if not isinstance(key,str) or not isinstance(node,str) or not key or not node or len(key)>100 or len(node)>100:
                    raise APIError(400,'Mission path and node are required.')
                progress = x['missionsProgress'].setdefault(key,[])
                if node not in progress:
                    progress.append(node)
                    reward['xp'] = 150
            elif path.startswith('skills/achievements/') and path.endswith('/claim'):
                try:identifier = int(path.split('/')[2])
                except ValueError:raise APIError(400,'Invalid achievement.')
                if identifier not in x['unlockedAchievements']:
                    raise APIError(400,'Achievement is not unlocked.')
                if identifier not in x['claimedAchievements']:
                    x['claimedAchievements'].append(identifier)
                    reward = dict(zip(('xp','coins'),{1:(100,20),2:(200,50),3:(150,30),4:(250,50),5:(200,40),6:(150,25)}[identifier]))
            else:
                raise APIError(404,'Skill route not found.')
            x['xp'] += reward['xp']; x['coins'] += reward['coins']
            x['level'] = 1 + sum(x['xp'] >= n for n in (200,500,1000,2000,4000))
            unlocked = set(x['unlockedAchievements']) | {1}
            if x['level'] >= 5:unlocked.add(2)
            if x['stats']['totalGames'] >= 10:unlocked.add(3)
            if len(x['completedChallenges']) == 4:unlocked.add(4)
            if x['streak'] >= 5:unlocked.add(5)
            if any(x['missionsProgress'].values()):unlocked.add(6)
            x['unlockedAchievements'] = sorted(unlocked)
            return x
        profile = self.store.update('SkillProfile',profile['id'],change)
        return {'profile':profile,'reward':reward}

    def evaluated_goals(self):
        from .summaries import evaluate_goal
        return [evaluate_goal(self.store,g) for g in self.store.list('Goal')]

    def goals(self, method, path, body):
        coding = path.startswith('coding/')
        prefix = 'coding/goals' if coding else 'goals'
        tail = path[len(prefix):].strip('/')
        def present(g):
            from .summaries import evaluate_goal
            g = evaluate_goal(self.store,g)
            return {**g,'targetCount':g['targetValue'],'currentCount':g['currentValue'],'period':g['period'].title()} if coding else g
        if method == 'GET' and tail in ('','summary'):
            goals = [present(g) for g in self.store.list('Goal') if not coding or g.get('category') == 'coding']
            if tail == 'summary':
                active = [g for g in goals if g.get('status') != 'archived']
                done = sum(g['completed'] for g in active)
                return {'goals':active,'activeCount':sum(g['status']=='active' for g in active),'completedCount':done,'overallCompletionRate':round(done/len(active)*100) if active else 0}
            return {'goals':goals}
        if method == 'POST' and not tail:
            data = dict(body)
            period = str(data.get('period','weekly' if coding else 'daily')).lower()
            start = datetime.now(timezone.utc).date()
            if period == 'weekly':start -= timedelta(days=start.weekday())
            if period == 'monthly':start = start.replace(day=1)
            end = start + timedelta(days={'daily':0,'weekly':6,'monthly':30,'lifetime':36500,'custom':0}.get(period,0))
            data.update(period=period,startDate=data.get('startDateInput') or start.isoformat(),endDate=data.get('endDateInput') or end.isoformat())
            if coding:data.update(category='coding',metric='dsa_problems_solved',targetValue=data.get('targetCount',1))
            return {'goal':present(self.store.create('Goal',validate('Goal',data)))}
        identifier = tail.split('/')[0]
        old = self.store.get('Goal',identifier)
        if coding and old.get('category') != 'coding':raise APIError(404,'Goal not found.')
        if method == 'DELETE' and '/' not in tail:
            self.store.delete('Goal',identifier)
            return {}
        if method in ('PUT','PATCH'):
            data = dict(body)
            if tail.endswith('/progress') or coding and 'currentCount' in data:
                data = {'manualCurrentValue':number(body.get('currentValue',body.get('currentCount'))),'metric':'custom'}
            if 'period' in data:data['period']=str(data['period']).lower()
            return {'goal':present(self.store.update('Goal',identifier,lambda x:validate('Goal',data,x)))}
        raise APIError(405,'Method not allowed.')

    def process_queue(self):
        count = 0
        for job in self.store.list('NotificationQueue'):
            if job.get('status') != 'pending' or job.get('scheduledFor','') > now():continue
            identifier = self.store.stable_id('Notification',job['id'])
            try:
                self.store.create('Notification',validate('Notification',{'title':job['title'],'message':job.get('message',''),'type':job.get('type','system')}),identifier)
                count += 1
            except APIError as exc:
                if exc.status != 409:raise
            self.store.update('NotificationQueue',job['id'],lambda x:{**x,'status':'sent','sentAt':now()})
        return {'processedCount':count}

    def migration(self, method, path, body):
        row = self.store.singleton('DataMigration')
        if method == 'GET' and path == 'migration/status':
            return {'migrated':row.get('status')=='completed','isMigrated':row.get('status')=='completed','status':row.get('status','pending'),'importedCounts':row.get('importedCounts',{})}
        if method != 'POST' or path != 'migration/import':raise APIError(405,'Method not allowed.')
        data = body.get('data')
        if not isinstance(data,dict):raise APIError(400,'Legacy data must be an object.')
        from .migration import import_legacy
        counts = import_legacy(self.store,data)
        self.store.update('DataMigration',row['id'],lambda x:{**x,'status':'completed','importedCounts':counts,'completedAt':now()})
        return {'migrated':True,'isMigrated':True,'status':'completed','importedCounts':counts}
