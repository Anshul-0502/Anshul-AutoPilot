"""Supabase REST adapter. Every data request uses the user's verified JWT and RLS."""
import copy
import json
import os
import uuid
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from .domain import APIError, TABLES, CONTRACTS, SINGLETONS, defaults

class Supabase:
    def __init__(self):
        config_path = Path(__file__).with_name('project.json')
        config = json.loads(config_path.read_text()) if config_path.exists() else {}
        self.url = os.environ.get('SUPABASE_URL', config.get('url', '')).rstrip('/')
        self.key = os.environ.get('SUPABASE_PUBLISHABLE_KEY', config.get('publishable_key', ''))

    def call(self, method, path, body=None, token=None, query=None, headers=None):
        if not self.url.startswith('https://') or not self.key:
            raise APIError(503, 'Database connection is not configured. Set Supabase environment variables.')
        url = self.url + path + (('?' + urlencode(query)) if query else '')
        request_headers = {'apikey': self.key, 'Content-Type': 'application/json', **(headers or {})}
        if token:
            request_headers['Authorization'] = 'Bearer ' + token
        req = Request(url, data=json.dumps(body).encode() if body is not None else None, headers=request_headers, method=method)
        try:
            with urlopen(req, timeout=15) as response:
                raw = response.read()
                return json.loads(raw) if raw else None
        except HTTPError as exc:
            try:
                data = json.loads(exc.read())
            except Exception:
                data = {}
            if path.startswith('/auth/'):
                code = data.get('error_code') or data.get('code')
                if exc.code == 429:
                    raise APIError(429, 'Too many attempts. Please wait and try again.')
                if code == 'email_not_confirmed':
                    raise APIError(403, 'Please confirm your email before signing in.')
                if path.endswith('/user') and exc.code in (401, 403):
                    raise APIError(401, 'Session expired. Please sign in again.')
                raise APIError(401 if 'token' in path else 400, 'Invalid credentials or authentication request. Check your email and password.')
            if exc.code == 409:
                raise APIError(409, 'Record already exists or was updated. Please retry.')
            if exc.code in (401, 403):
                raise APIError(403, 'You do not have access to this record.')
            if exc.code == 400:
                raise APIError(400, 'Database rejected the data. Check the submitted fields.')
            raise APIError(503, 'Database is temporarily unavailable. Please retry.')
        except (URLError, TimeoutError):
            raise APIError(503, 'Supabase could not be reached. Please retry.')

class Store:
    def __init__(self, provider, token, user_id):
        self.provider, self.token, self.user_id = provider, token, user_id

    def request(self, model, method, body=None, query=None, headers=None):
        if model not in TABLES:
            raise APIError(404, 'Unknown resource.')
        return self.provider.call(method, '/rest/v1/' + TABLES[model], body, self.token,
                                  {'user_id': 'eq.' + self.user_id, **(query or {})}, headers)

    def list(self, model):
        result, offset = [], 0
        while True:
            rows = self.request(model, 'GET', query={'order': 'created_at.desc,id.desc', 'offset': offset, 'limit': 500})
            result.extend(self.public(row) for row in rows)
            if len(rows) < 500:
                return result
            offset += 500

    @staticmethod
    def public(row):
        return {**row['payload'], 'id': row['id'], '_id': row['id'], 'userId': row['user_id'],
                'createdAt': row['created_at'], 'updatedAt': row['updated_at'], '_version': row['version']}

    def get(self, model, identifier):
        try:
            uuid.UUID(str(identifier))
        except ValueError:
            raise APIError(404, 'Record not found.')
        rows = self.request(model, 'GET', query={'id': 'eq.' + str(identifier)})
        if not rows:
            raise APIError(404, 'Record not found.')
        return self.public(rows[0])

    def create(self, model, payload, identifier=None):
        identifier = identifier or str(uuid.uuid4())
        rows = self.request(model, 'POST', {'id': identifier, 'user_id': self.user_id, 'payload': payload},
                            headers={'Prefer': 'return=representation'})
        return self.public(rows[0])

    def singleton(self, model, extra=None):
        identifier = self.stable_id(model, 'singleton')
        try:
            return self.get(model, identifier)
        except APIError as exc:
            if exc.status != 404:
                raise
        try:
            return self.create(model, {**defaults(CONTRACTS[model]), **(extra or {})}, identifier)
        except APIError as exc:
            if exc.status != 409:
                raise
            return self.get(model, identifier)

    def stable_id(self, model, key):
        return str(uuid.uuid5(uuid.NAMESPACE_URL, f'autopilot:{self.user_id}:{model}:{key}'))

    def update(self, model, identifier, transform):
        # Optimistic concurrency; reapply mutation to latest value, never overwrite another increment.
        for _ in range(5):
            old = self.get(model, identifier)
            payload = transform(copy.deepcopy(old))
            for k in ('id', '_id', 'userId', 'createdAt', 'updatedAt', '_version'):
                payload.pop(k, None)
            rows = self.request(model, 'PATCH', {'payload': payload, 'version': old['_version'] + 1},
                                {'id': 'eq.' + str(identifier), 'version': 'eq.' + str(old['_version'])},
                                {'Prefer': 'return=representation'})
            if rows:
                return self.public(rows[0])
        raise APIError(409, 'Concurrent update. Please retry.')

    def delete(self, model, identifier):
        self.get(model, identifier)
        self.request(model, 'DELETE', query={'id': 'eq.' + str(identifier)})

    def clear(self, model):
        self.request(model, 'DELETE')

    def dated(self, model, date, extra=None):
        identifier = self.stable_id(model, date)
        try:
            return self.get(model, identifier)
        except APIError as exc:
            if exc.status != 404:
                raise
        try:
            return self.create(model, {**defaults(CONTRACTS[model]), **(extra or {}), 'date': date}, identifier)
        except APIError as exc:
            if exc.status != 409:
                raise
            return self.get(model, identifier)
