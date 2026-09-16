// User-scoped caches prevent a previous account's browser data appearing after login.
const rawGet = Storage.prototype.getItem;
const rawSet = Storage.prototype.setItem;
const rawRemove = Storage.prototype.removeItem;
let owner = null;
const isAppKey = key => key.startsWith('anshul_autopilot_') || key.startsWith('autopilot-');
const scoped = key => `autopilot_user:${owner}:${key}`;
export const setStorageUser = id => { owner = id || null; };
Storage.prototype.getItem = function (key) {
  if (this !== localStorage || !isAppKey(key) || key === 'autopilot-theme') return rawGet.call(this, key);
  // Historical seed datasets belong to the demo; new accounts start with real empty data.
  if (key.endsWith('_seeded')) return 'true';
  return owner ? rawGet.call(this, scoped(key)) : null;
};
Storage.prototype.setItem = function (key, value) {
  if (this !== localStorage || !isAppKey(key) || key === 'autopilot-theme') return rawSet.call(this, key, value);
  if (owner) rawSet.call(this, scoped(key), value);
};
Storage.prototype.removeItem = function (key) {
  if (this !== localStorage || !isAppKey(key) || key === 'autopilot-theme') return rawRemove.call(this, key);
  if (owner) rawRemove.call(this, scoped(key));
};
