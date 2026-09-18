import { setStorageUser } from '../sessionStorage';
// Same-origin API avoids third-party cookie/CORS failures on deployed sites.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
let refreshPromise = null;
const refreshSession = () => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST', credentials: 'include', headers: { 'X-Autopilot-Client': 'web' },
    }).then(r => r.ok).finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
};

export const apiClient = async (endpoint, options = {}) => {
  const headers = { 'Content-Type': 'application/json', 'X-Autopilot-Client': 'web', 'Idempotency-Key': crypto.randomUUID(), ...options.headers };
  const config = { ...options, credentials: 'include', headers };
  if (options.body && typeof options.body === 'object') {
    // UI objects include read-only identity fields; ownership always comes from the verified session.
    const { userId, user_id, _version, createdAt, updatedAt, ...body } = options.body;
    config.body = JSON.stringify(body);
  }
  const send = () => fetch(`${API_BASE_URL}${endpoint}`, config);
  let response = await send();
  if (response.status === 401 && !['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'].includes(endpoint)) {
    if (await refreshSession()) response = await send();
  }
  let data;
  try { data = await response.json(); }
  catch { throw new Error('API returned an invalid response. Please try again.'); }
  if (endpoint === '/auth/logout') setStorageUser(null);
  if (endpoint.startsWith('/auth/') && data.data?.user?.id) setStorageUser(data.data.user.id);
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status}).`);
  if (endpoint === '/ai/chat' && Array.isArray(data.data)) {
    data.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }
  return data;
};
export default apiClient;
