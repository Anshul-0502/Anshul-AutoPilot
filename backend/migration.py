"""Explicit, idempotent import of user-selected legacy browser data."""
import hashlib
import json
from .domain import APIError,validate

SIMPLE = {
 'autopilot-study-sessions':'StudySession','autopilot-study-notes':'StudyNote',
 'autopilot-study-pdfs':'StudyPdf','autopilot-study-revisions':'StudyRevision',
 'anshul_autopilot_projects_data':'Project','anshul_autopilot_tasks_data':'Task',
 'anshul_autopilot_tasks_data_cache':'Task','anshul_autopilot_planner_events':'PlannerEvent',
}
CODING = {'languages':'CodingLanguage','problems':'DSAProblem','notes':'CodingNote','snippets':'CodeSnippet',
          'resources':'CodingResource','interviewTopics':'InterviewTopic','timerLogs':'CodingSession'}

def import_legacy(store,data):
    pending=[]; preferences=None
    for key,value in data.items():
        try:value=json.loads(value) if isinstance(value,str) else value
        except ValueError:raise APIError(400,f'Invalid legacy JSON in {key}. No data was imported.')
        if key in SIMPLE:
            if key=='anshul_autopilot_tasks_data' and 'anshul_autopilot_tasks_data_cache' in data:continue
            if isinstance(value,dict):value=value.get('tasks',[])
            pending.extend((SIMPLE[key],r) for r in value)
        elif key=='anshul_autopilot_coding_data':
            for field,model in CODING.items():pending.extend((model,r) for r in value.get(field,[]))
        elif key=='anshul_autopilot_health_data':
            for field,model in [('sleepHistory','SleepLog'),('workouts','Workout'),('habits','Habit'),('meditationHistory','MeditationSession')]:
                pending.extend((model,r) for r in value.get(field,[]))
        elif key=='anshul_autopilot_settings_data':preferences=value
    if len(pending)>3000:raise APIError(400,'Import at most 3000 records at once.')
    validated=[]
    for model,row in pending:
        if not isinstance(row,dict):raise APIError(400,'Invalid legacy record.')
        row={k:v for k,v in row.items() if k not in ('userId','user_id','role','accountStatus')}
        digest=hashlib.sha256(json.dumps(row,sort_keys=True).encode()).hexdigest()
        validated.append((model,validate(model,row),store.stable_id(model,'legacy:'+digest)))
    if preferences is not None:preferences=validate('UserPreferences',preferences)
    counts={}
    for model,payload,identifier in validated:
        try:store.create(model,payload,identifier)
        except APIError as exc:
            if exc.status==409:continue
            raise
        counts[model]=counts.get(model,0)+1
    if preferences is not None:
        p=store.singleton('UserPreferences')
        store.update('UserPreferences',p['id'],lambda x:validate('UserPreferences',preferences,x))
    return counts
