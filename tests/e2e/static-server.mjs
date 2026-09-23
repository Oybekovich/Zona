// Static server for tests that applies vercel.json headers (to test CSP like production)
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
const ROOT = process.argv[2], PORT = Number(process.argv[3] || 8000);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
let rules = [];
try { rules = JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf8')).headers || []; } catch {}
http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(ROOT, p === '/' ? 'index.html' : p);
  if (!f.startsWith(ROOT) || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); return res.end('nf'); }
  const h = { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' };
  for (const r of rules) {
    const re = new RegExp('^' + r.source.replace(/\(\.\*\)/g, '(.*)') + '$');
    if (re.test(p)) for (const x of r.headers) h[x.key] = x.value;
  }
  res.writeHead(200, h); res.end(readFileSync(f));
}).listen(PORT, '127.0.0.1');
