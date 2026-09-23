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
const dir = process.env.ADMIN_DIR || new URL('../../../Zona-Admin', import.meta.url).pathname;
const { default: handler } = await import(dir + '/api/index.mjs');
http.createServer(handler).listen(Number(process.env.ADMIN_PORT || 8080), '127.0.0.1', () => console.log('admin on 8080'));
