"""Validated document contracts, preserving the existing React API shapes."""
import copy
import json
import math
import re
from datetime import datetime, timezone, timedelta
from pathlib import Path

CONTRACTS = json.loads(Path(__file__).with_name('contracts.json').read_text())
TABLES = {name: 'ap_' + re.sub(r'(?<!^)(?=[A-Z][a-z])', '_', name).lower() for name in CONTRACTS}
SINGLETONS = {'UserProfile', 'UserPreferences', 'HealthProfile', 'SkillProfile', 'DataMigration'}

class APIError(Exception):
    def __init__(self, status, message):
        self.status, self.message = status, message
        super().__init__(message)

def now():
    return datetime.now(timezone.utc).isoformat()

def day(value=None):
    if value is None:
        return datetime.now(timezone.utc).date().isoformat()
    value = str(value)
    for fmt in ('%Y-%m-%d', '%m/%d/%Y', '%m-%d-%Y'):
        try:
            return datetime.strptime(value[:10] if fmt == '%Y-%m-%d' else value, fmt).date().isoformat()
        except ValueError:
            pass
    raise APIError(400, 'Invalid date. Use YYYY-MM-DD.')

def number(value, low=0, high=1000000):
    if isinstance(value, bool):
        raise APIError(400, 'Expected a number.')
    try:
        v = float(value)
    except (TypeError, ValueError):
        raise APIError(400, 'Expected a number.')
    if not math.isfinite(v) or v < low or v > high:
        raise APIError(400, f'Number must be between {low} and {high}.')
    return int(v) if v.is_integer() else v

def defaults(schema):
    if 'default' in schema and schema['default'] is not None:
        return copy.deepcopy(schema['default'])
    if schema.get('type') == 'object':
        return {k: defaults(v) for k, v in schema.get('properties', {}).items() if defaults(v) is not None}
    if schema.get('type') == 'array':
        return []
    return None

def clean(schema, value, path='', partial=False):
    typ = schema.get('type')
    if value is None:
        if schema.get('required'):
            raise APIError(400, f'{path} is required.')
        return None
    if typ == 'object':
        if not isinstance(value, dict):
            raise APIError(400, f'{path} must be an object.')
        props = schema.get('properties')
        if props is None:
            if len(value) > 2000 or any(str(k).startswith('$') or k in ('__proto__', 'constructor', 'prototype') for k in value):
                raise APIError(400, 'Invalid object.')
            return copy.deepcopy(value)
        out = {} if partial else defaults(schema)
        for k, v in value.items():
            if k in props:
                out[k] = clean(props[k], v, f'{path}.{k}', partial)
        if not partial:
            for k, s in props.items():
                if s.get('required') and (k not in out or out[k] in (None, '')):
                    raise APIError(400, f'{path}.{k} is required.')
        return out
    if typ == 'array':
        if not isinstance(value, list) or len(value) > 2000:
            raise APIError(400, f'{path} must be an array of at most 2000 items.')
        return [clean(schema.get('items', {}), item, path, partial) for item in value]
    if typ == 'string':
        if not isinstance(value, str) or len(value) > 100000:
            raise APIError(400, f'{path} must be a string of at most 100000 characters.')
        if schema.get('required') and not value.strip():
            raise APIError(400, f'{path} is required.')
    if typ == 'number':
        value = number(value, schema.get('min', 0), schema.get('max', 1000000))
    if typ == 'boolean' and not isinstance(value, bool):
        raise APIError(400, f'{path} must be true or false.')
    if typ == 'date' and value:
        day(value)
    if schema.get('enum') and value not in schema['enum']:
        # Existing UI uses mixed casing for a few select values.
        matched = [x for x in schema['enum'] if str(x).lower() == str(value).lower()]
        if not matched:
            raise APIError(400, f'Invalid value for {path}.')
        value = matched[0]
    return value

def merge(base, updates):
    result = copy.deepcopy(base)
    for key, value in updates.items():
        result[key] = merge(result.get(key, {}), value) if isinstance(value, dict) and isinstance(result.get(key, {}), dict) else copy.deepcopy(value)
    return result

def validate(model, body, old=None):
    if not isinstance(body, dict):
        raise APIError(400, 'JSON body must be an object.')
    for k in ('userId', 'user_id', 'role', 'accountStatus'):
        if k in body:
            raise APIError(400, 'Ownership and authorization fields cannot be changed.')
    result = merge(old or {}, clean(CONTRACTS[model], body, model, partial=old is not None))
    # Validate the complete merged document as well.
    result = clean(CONTRACTS[model], result, model)
    if model == 'Task':
        completed = body.get('completed', body.get('status') == 'done' if 'status' in body else result.get('completed', False))
        result.update(completed=completed, status='done' if completed else ('todo' if body.get('completed') is False else result.get('status', 'todo')),
                      completedAt=(old or {}).get('completedAt') or now() if completed else None)
    if model == 'Project':
        tasks = result.get('tasks', [])
        if tasks:
            result['progress'] = round(sum(str(t.get('status','')).lower() == 'done' or t.get('completed', False) for t in tasks) / len(tasks) * 100)
    if model == 'StudyCourse':
        modules = result.get('modules', [])
        result['progress'] = round(sum(bool(m.get('completed')) for m in modules) / len(modules) * 100) if modules else 0
    return result

def streak(dates):
    dates = {day(d) for d in dates if d}
    current = datetime.now(timezone.utc).date()
    if current.isoformat() not in dates:
        current -= timedelta(days=1)
    count = 0
    while current.isoformat() in dates:
        count += 1
        current -= timedelta(days=1)
    return count
