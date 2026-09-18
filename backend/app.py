"""Dependency-free Python WSGI application for Vercel and local development."""
import json
import logging
import os
from http import HTTPStatus
from http.cookies import SimpleCookie
from urllib.parse import parse_qs, urlsplit
from .domain import APIError
from .store import Supabase, Store
from . import auth

MAX_BODY = 2 * 1024 * 1024

class Application:
    def __init__(self, provider=None, store_factory=Store):
        self.provider = provider or Supabase()
        self.store_factory = store_factory

    def __call__(self, environ, start_response):
        headers = [('Content-Type','application/json; charset=utf-8'), ('Cache-Control','no-store, private'),
                   ('X-Content-Type-Options','nosniff'), ('Referrer-Policy','same-origin')]
        status = 200
        try:
            method = environ.get('REQUEST_METHOD', 'GET')
            query = {k:v[-1] for k,v in parse_qs(environ.get('QUERY_STRING','')).items()}
            request_path = environ.get('PATH_INFO', '')
            if request_path in ('/api/index', '/api/index.py'):
                path = query.pop('_route', '').strip('/')
            elif request_path.startswith('/api/v1/'):
                path = request_path.removeprefix('/api/v1/').strip('/')
                query.pop('_route', None)
            else:
                raise APIError(404, 'API route not found.')
            secure = os.getenv('VERCEL') == '1' or environ.get('wsgi.url_scheme') == 'https'
            cookies_obj = SimpleCookie()
            cookies_obj.load(environ.get('HTTP_COOKIE', ''))
            cookies = {k: v.value for k,v in cookies_obj.items()}
            body = {}
            if method not in ('GET','HEAD','OPTIONS'):
                if environ.get('HTTP_X_AUTOPILOT_CLIENT') != 'web':
                    raise APIError(403, 'Missing request verification header.')
                origin = environ.get('HTTP_ORIGIN')
                host = environ.get('HTTP_HOST')
                if origin and urlsplit(origin).netloc != host:
                    raise APIError(403, 'Cross-origin request rejected.')
                try:
                    length = int(environ.get('CONTENT_LENGTH') or 0)
                except ValueError:
                    raise APIError(400, 'Invalid request length.')
                if length < 0 or length > MAX_BODY:
                    raise APIError(413, 'Request exceeds 2 MB.')
                if length:
                    if environ.get('CONTENT_TYPE','').split(';')[0] != 'application/json':
                        raise APIError(415, 'Send application/json.')
                    try:
                        body = json.loads(environ['wsgi.input'].read(length), parse_constant=lambda _: (_ for _ in ()).throw(ValueError()))
                    except (ValueError, UnicodeError):
                        raise APIError(400, 'Invalid JSON.')
                    if not isinstance(body, dict):
                        raise APIError(400, 'JSON body must be an object.')
            if path == 'health' and method == 'GET':
                configured = bool(self.provider.url and self.provider.key)
                data = {'status':'ok' if configured else 'configuration_required','database':'Supabase PostgreSQL','configured':configured}
                status = 200 if configured else 503
            elif path.startswith('auth/'):
                action = path.split('/')[1]
                if method != ('GET' if action == 'me' else 'POST'):
                    raise APIError(405, 'Method not allowed.')
                data, extra_headers = auth.handle(self.provider, action, body, cookies, secure)
                headers.extend(extra_headers)
            else:
                user, token = auth.identify(self.provider, cookies)
                store = self.store_factory(self.provider, token, user['id'])
                from .service import Service
                if path == 'health/focus-sessions' and method == 'POST':
                    body['_request_id'] = environ.get('HTTP_IDEMPOTENCY_KEY')
                data, status = Service(store, user).dispatch(method, path, body, query)
            payload = {'success':status < 400, 'data':data}
        except APIError as exc:
            status, payload = exc.status, {'success':False,'message':exc.message}
        except Exception:
            logging.exception('Unhandled API error')
            status, payload = 500, {'success':False,'message':'Unexpected server error. Please retry.'}
        raw = json.dumps(payload, allow_nan=False).encode()
        headers.append(('Content-Length',str(len(raw))))
        start_response(f'{status} {HTTPStatus(status).phrase}',headers)
        return [raw]

app = Application()
