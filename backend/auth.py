"""Supabase Auth with same-origin HttpOnly sessions and explicit refresh."""
import re
from http.cookies import SimpleCookie
from .domain import APIError

ACCESS = 'autopilot_access'
REFRESH = 'autopilot_refresh'

def user_view(user):
    metadata = user.get('user_metadata') or {}
    return {'id': user['id'], '_id': user['id'], 'name': metadata.get('name') or user.get('email', '').split('@')[0],
            'email': user.get('email', ''), 'avatar': metadata.get('avatar', ''), 'role': 'user',
            'accountStatus': 'active', 'createdAt': user.get('created_at'), 'lastLoginAt': user.get('last_sign_in_at')}

def session_cookies(session, secure):
    out = []
    for name, key, path, age in [(ACCESS, 'access_token', '/api', session.get('expires_in', 3600)),
                                (REFRESH, 'refresh_token', '/api/v1/auth', 30 * 86400)]:
        cookie = SimpleCookie()
        cookie[name] = session[key]
        cookie[name]['path'] = path
        cookie[name]['max-age'] = int(age)
        cookie[name]['httponly'] = True
        cookie[name]['samesite'] = 'Lax'
        if secure:
            cookie[name]['secure'] = True
        out.append(('Set-Cookie', cookie[name].OutputString()))
    return out

def clear_cookies(secure):
    return session_cookies({'access_token': '', 'refresh_token': '', 'expires_in': 0}, secure)[:1] + [
        ('Set-Cookie', f'{REFRESH}=; Path=/api/v1/auth; Max-Age=0; HttpOnly; SameSite=Lax' + ('; Secure' if secure else ''))]

def identify(provider, cookies):
    token = cookies.get(ACCESS)
    if not token:
        raise APIError(401, 'Please sign in to continue.')
    user = provider.call('GET', '/auth/v1/user', token=token)
    if not user or not user.get('id'):
        raise APIError(401, 'Session is invalid. Please sign in again.')
    return user_view(user), token

def handle(provider, action, body, cookies, secure):
    if action in ('login', 'register'):
        email, password = body.get('email'), body.get('password')
        if not isinstance(email, str) or not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', email.strip()) or len(email) > 254:
            raise APIError(400, 'Enter a valid email address.')
        if not isinstance(password, str) or not 6 <= len(password) <= 128:
            raise APIError(400, 'Password must contain 6 to 128 characters.')
        credentials = {'email': email.strip().lower(), 'password': password}
        if action == 'register':
            name = body.get('name', '')
            if not isinstance(name, str) or not 2 <= len(name.strip()) <= 100:
                raise APIError(400, 'Name must contain 2 to 100 characters.')
            session = provider.call('POST', '/auth/v1/signup', {**credentials, 'data': {'name': name.strip()}})
            if not session.get('access_token'):
                # Existing register form displays server messages in its message area.
                raise APIError(400, 'Registration received. Check your email to confirm your account, then sign in.')
        else:
            session = provider.call('POST', '/auth/v1/token', credentials, query={'grant_type': 'password'})
        return {'user': user_view(session['user'])}, session_cookies(session, secure)
    if action == 'refresh':
        if not cookies.get(REFRESH):
            raise APIError(401, 'Please sign in again.')
        session = provider.call('POST', '/auth/v1/token', {'refresh_token': cookies[REFRESH]}, query={'grant_type': 'refresh_token'})
        return {'user': user_view(session['user'])}, session_cookies(session, secure)
    if action == 'logout':
        if cookies.get(ACCESS):
            try:
                provider.call('POST', '/auth/v1/logout', token=cookies[ACCESS], query={'scope': 'local'})
            except APIError as exc:
                if exc.status not in (400, 401, 403):
                    raise
        return {}, clear_cookies(secure)
    if action == 'me':
        user, _ = identify(provider, cookies)
        return {'user': user}, []
    raise APIError(404, 'Authentication route not found.')
