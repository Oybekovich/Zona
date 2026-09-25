// Runs Zona-Admin handler locally with Management API redirected to the mock.
import http from 'node:http';
const realFetch = globalThis.fetch;
globalThis.fetch = (url, opts) => {
  const u = String(url);
  if (u.startsWith('https://api.supabase.com/')) return realFetch(u.replace('https://api.supabase.com', 'http://127.0.0.1:54321'), opts);
  return realFetch(url, opts);
};
process.env.ADMIN_USERNAME ||= 'testadmin';
process.env.ADMIN_PASSWORD ||= 'testpass123';
process.env.HMAC_SECRET ||= 'test-hmac-secret-0123456789';
process.env.SUPABASE_PROJECT_REF ||= 'localref';
process.env.SUPABASE_ACCESS_TOKEN ||= 'sbp_test';
process.env.PUSH_HOOK_SECRET ||= 'test-push-secret';
process.env.PUSH_ALLOW_LOCAL ||= '1';
/* token 10 kundan keyin tugaydi — panelda ogohlantirish chiqishi kerak */
process.env.SUPABASE_TOKEN_EXPIRES ||= new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10);
const dir = process.env.ADMIN_DIR || new URL('../../../Zona-Admin', import.meta.url).pathname;
if (!process.env.VAPID_PUBLIC_KEY) {
  const { generateVapidKeys } = await import(dir + '/push.mjs');
  const k = generateVapidKeys();
  process.env.VAPID_PUBLIC_KEY = k.publicKey;
  process.env.VAPID_PRIVATE_KEY = k.privateKey;
}
const { default: handler } = await import(dir + '/api/index.mjs');
http.createServer(handler).listen(Number(process.env.ADMIN_PORT || 8080), '127.0.0.1', () => console.log('admin on 8080'));
