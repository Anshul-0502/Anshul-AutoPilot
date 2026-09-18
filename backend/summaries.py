"""Read model summaries, calculated from the authenticated user's stored records."""
from collections import Counter, defaultdict
from datetime import datetime, timezone, timedelta
from .domain import day, streak


def safe_day(value):
    try:return day(value)
    except Exception:return ''

def percent(a,b):return round(a/b*100) if b else 0

def evaluate_goal(store,g):
    metric = g.get('metric','custom')
    source = g.get('sourceFilter',{})
    def eligible(row):
        d = safe_day(row.get('dateLogged') or row.get('date') or row.get('completedAt') or row.get('createdAt'))
        return (not g.get('startDate') or d >= safe_day(g['startDate'])) and (not g.get('endDate') or d <= safe_day(g['endDate']))
    routes = {
        'dsa_problems_solved':('DSAProblem',lambda r: int(str(r.get('status','')).lower()=='solved')),
        'coding_minutes':('CodingSession',lambda r:r.get('durationMinutes',0)),
        'study_minutes':('StudySession',lambda r:r.get('durationSeconds',0)/60),
        'tasks_completed':('Task',lambda r:int(r.get('completed',False))),
        'projects_completed':('Project',lambda r:int(r.get('progress',0)>=100 or r.get('status')=='Completed')),
        'workouts_completed':('Workout',lambda r:1),
        'meditation_minutes':('MeditationSession',lambda r:r.get('duration',0)),
        'water_goal_days':('WaterLog',lambda r:int(r.get('intake',0)>=r.get('goal',8))),
        'focus_minutes':('FocusSession',lambda r:r.get('duration',0)),
    }
    value = g.get('manualCurrentValue',0)
    if metric in routes:
        model,amount = routes[metric]
        rows = store.list(model)
        value = sum(amount(r) for r in rows if eligible(r) and all(not source.get(k) or r.get(k)==source[k] for k in ('topic','platform','type')) and (not source.get('subjectId') or r.get('subject')==source['subjectId']) and (not source.get('projectId') or r.get('id')==source['projectId']))
    if metric == 'xp_earned':value=store.singleton('SkillProfile').get('xp',0)
    target = g.get('targetValue',1)
    return {**g,'currentValue':round(value,2),'progressPercent':min(100,percent(value,target)),'completed':value>=target}


def summarize(service,path,query):
    store,user = service.store,service.user
    today = day()
    tasks, events = store.list('Task'),store.list('PlannerEvent')
    subjects, sessions = store.list('StudySubject'),store.list('StudySession')
    revisions = store.list('StudyRevision')
    problems, coding = store.list('DSAProblem'),store.list('CodingSession')
    projects = store.list('Project')
    skill = store.singleton('SkillProfile')
    health = service.health_data(today)
    goals = service.evaluated_goals()
    solved = [p for p in problems if str(p.get('status','')).lower()=='solved']
    study_streak = streak([safe_day(s.get('date')) for s in sessions if safe_day(s.get('date'))])
    coding_streak = streak([safe_day(s.get('date')) for s in coding if safe_day(s.get('date'))]+[safe_day(s.get('dateLogged')) for s in solved if safe_day(s.get('dateLogged'))])
    sm = sum(s.get('durationSeconds',0)/60 for s in sessions)
    cm = sum(s.get('durationMinutes',0) for s in coding)
    study_today = sum(s.get('durationSeconds',0)/60 for s in sessions if safe_day(s.get('date'))==today)
    coding_today = sum(s.get('durationMinutes',0) for s in coding if safe_day(s.get('date'))==today)
    start_week = (datetime.now(timezone.utc).date()-timedelta(days=datetime.now(timezone.utc).weekday())).isoformat()
    if path == 'study/summary':
        dist=defaultdict(float)
        for s in sessions:dist[s.get('subject','General')]+=s.get('durationSeconds',0)/60
        return {'totalMinutes':sm,'todayMinutes':study_today,'weekMinutes':sum(s.get('durationSeconds',0)/60 for s in sessions if safe_day(s.get('date'))>=start_week),
                'monthMinutes':sum(s.get('durationSeconds',0)/60 for s in sessions if safe_day(s.get('date')).startswith(today[:7])),
                'sessionCount':len(sessions),'streak':study_streak,'subjectDistribution':dict(dist),'upcomingRevisionsCount':sum(r.get('status')=='upcoming' for r in revisions)}
    if path == 'coding/summary':
        return {'totalProblems':len(problems),'solvedProblems':len(solved),'solvedToday':sum(safe_day(p.get('dateLogged'))==today for p in solved),
                'codingMinutesToday':coding_today,'codingMinutesWeek':sum(s.get('durationMinutes',0) for s in coding if safe_day(s.get('date'))>=start_week),
                'currentStreak':coding_streak,'activeGoalCount':sum(not g['completed'] for g in goals if g.get('category')=='coding')}
    if path == 'dashboard/summary':
        today_events = [e for e in events if safe_day(e.get('date'))==today]
        sleep = next((x for x in health['sleepHistory'] if safe_day(x.get('date'))==today),{})
        return {'user':user,
          'tasks':{'pending':sum(not t.get('completed') for t in tasks),'completed':sum(bool(t.get('completed')) for t in tasks),
                   'highPriority':sum(not t.get('completed') and str(t.get('priority','')).lower() in ('high','critical') for t in tasks),'recent':tasks[:3]},
          'calendar':{'eventDays':sorted({int(safe_day(e.get('date'))[-2:]) for e in events if safe_day(e.get('date')).startswith(today[:7])}),
                      'upcomingEvents':[{'time':e.get('startTime'),'title':e.get('title'),'type':e.get('category')} for e in sorted(today_events,key=lambda x:x.get('startTime',''))]},
          'study':{'todayMinutes':study_today,'totalHours':round(sm/60,1),'streak':study_streak,'activeSubject':subjects[0]['name'] if subjects else 'None','subjects':subjects[:3],'upcomingRevisionsCount':sum(r.get('status')=='upcoming' for r in revisions)},
          'coding':{'solvedProblems':len(solved),'totalProblems':len(problems),'minutesToday':coding_today,'totalHours':round(cm/60,1),'streak':coding_streak,
                    'recentSolutions':[{'title':p['name'],'difficulty':p.get('difficulty'),'time':p.get('dateLogged')} for p in solved[:2]]},
          'projects':{'total':len(projects),'active':sum(p.get('status')=='In Progress' for p in projects),'list':projects[:3]},
          'skills':{k:skill.get(k,0) for k in ('level','xp','coins','streak')},
          'health':{'waterIntake':health['waterIntake'],'waterGoal':health['waterGoal'],'sleepDuration':sleep.get('hours',0),'sleepQuality':health.get('sleepQuality',0),
                    'habitsCompleted':sum(bool(h.get('history',{}).get(today)) for h in health['habits']),'habitsTotal':len(health['habits']),'reminders':health['reminders']},
          'goals':{'goalsCount':len(goals),'completedCount':sum(g['completed'] for g in goals),'overallCompletionRate':percent(sum(g['completed'] for g in goals),len(goals))},
          'notifications':store.list('Notification')[:3]}
    span = {'Daily':1,'Weekly':7,'Monthly':30,'Yearly':365}.get(query.get('filter','Weekly'),7)
    first = (datetime.now(timezone.utc).date()-timedelta(days=span-1)).isoformat()
    def period(rows):return [r for r in rows if first<=safe_day(r.get('dateLogged') or r.get('date') or r.get('createdAt'))<=today]
    sessions,coding,problems,tasks,projects = map(period,(sessions,coding,problems,tasks,projects))
    solved = [p for p in problems if str(p.get('status','')).lower()=='solved']
    done = [t for t in tasks if t.get('completed')]
    distribution=defaultdict(float)
    for s in sessions:distribution[s.get('subject','General')]+=s.get('durationSeconds',0)/3600
    languages=store.list('CodingLanguage'); total_progress=sum(l.get('progress',0) for l in languages)
    water=period(store.list('WaterLog')); sleep=period(store.list('SleepLog'))
    habits=health['habits']; completions=sum(sum(bool(v) for d,v in h.get('history',{}).items() if first<=d<=today) for h in habits)
    completed_revisions=period(revisions)
    productive=Counter(datetime.fromisoformat(t['updatedAt']).strftime('%A') for t in done)
    return {
      'study':{'totalHours':round(sum(s.get('durationSeconds',0) for s in sessions)/3600,1),'notesCreated':len(period(store.list('StudyNote'))),
               'pdfsCompleted':sum(p.get('totalPages',0)>0 and p.get('currentPage',0)>=p['totalPages'] for p in period(store.list('StudyPdf'))),
               'revisionRate':percent(sum(r.get('status')=='completed' for r in completed_revisions),len(completed_revisions)),'subjectHours':dict(distribution)},
      'coding':{'totalHours':round(sum(s.get('durationMinutes',0) for s in coding)/60,1),'problemsSolved':len(solved),'streak':coding_streak,
                'accuracy':percent(len(solved),len(problems)),'languages':{l['name']:percent(l.get('progress',0),total_progress) for l in languages},
                'difficulty':{d:sum(str(p.get('difficulty','')).lower()==d.lower() for p in solved) for d in ('Easy','Medium','Hard')}},
      'tasks':{'total':len(tasks),'completed':len(done),'pending':len(tasks)-len(done),'overdue':sum(not t.get('completed') and bool(t.get('deadline')) and safe_day(t['deadline'])<today for t in tasks),
               'completionRate':percent(len(done),len(tasks)),'avgMinutes':0,'productiveDay':productive.most_common(1)[0][0] if productive else 'None'},
      'projects':{'active':sum(p.get('status')!='Completed' for p in projects),'completed':sum(p.get('status')=='Completed' for p in projects),'devHours':0,
                  'milestones':sum(sum(m.get('progress',0)>=100 or m.get('completed',False) for m in p.get('milestones',[])) for p in projects),
                  'bugsFixed':sum(sum(b.get('status') in ('Resolved','Closed','completed') for b in p.get('bugs',[])) for p in projects),
                  'avgProgress':sum(p.get('progress',0) for p in projects)/len(projects) if projects else 0},
      'skill':{'xp':skill['xp'],'coins':skill['coins'],'level':skill['level'],'challengesDone':len(skill['completedChallenges']),
               'quizAccuracy':skill['stats']['accuracy'],'logicScore':skill['stats']['logicScore'],'reactionSpeed':skill['stats']['reactionTime']},
      'habits':{'waterIntake':sum(w.get('intake',0) for w in water)/len(water) if water else 0,'sleepHours':sum(s.get('hours',0) for s in sleep)/len(sleep) if sleep else 0,
                'exercise':'Yes' if period(health['workouts']) else 'No','completionRate':percent(completions,len(habits)*span),'streak':skill['streak']},
      'goals':{'successRate':percent(sum(g['completed'] for g in goals),len(goals)),'completedGoals':sum(g['completed'] for g in goals),
               'missedGoals':sum(not g['completed'] and safe_day(g.get('endDate'))<today for g in goals),'streak':skill['streak']}}
