import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, relative, extname, sep } from 'node:path';

const directory = resolve('out');
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/porto';
const port = Number(process.env.PORTFOLIO_PREVIEW_PORT ?? 4175);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon' };

createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/' && basePath) { res.writeHead(302, { Location: basePath + '/' }).end(); return; }
    if (basePath && pathname !== basePath && !pathname.startsWith(basePath + '/')) { res.writeHead(404).end('Not found'); return; }
    let file = resolve(directory, '.' + (pathname.slice(basePath.length) || '/'));
    const rel = relative(directory, file);
    if (rel.startsWith('..' + sep) || rel === '..') { res.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Content-Length': body.length, 'Cache-Control': 'no-cache' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(port, '127.0.0.1', () => {
  console.log('Static export preview: http://127.0.0.1:' + port + basePath + '/prototype/');
});
