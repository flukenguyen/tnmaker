// Chạy SAU prepare-web: biến www/ thành ứng dụng web cài được (PWA) cho iPhone/iPad và cả Android.
//  - thêm manifest, biểu tượng, thẻ apple-touch-icon
//  - tạo service worker lưu sẵn mọi tệp => dùng được offline sau lần mở đầu tiên
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const www = path.join(root, 'www');
const indexPath = path.join(www, 'index.html');
if (!fs.existsSync(indexPath)) throw new Error('Chưa có www/index.html (chạy npm run prepare-web trước).');

// 1. biểu tượng
fs.cpSync(path.join(root, 'icons'), path.join(www, 'icons'), { recursive: true });

// 2. manifest
fs.writeFileSync(path.join(www, 'manifest.webmanifest'), JSON.stringify({
  name: 'TNMaker Pro - Chấm trắc nghiệm',
  short_name: 'TNMaker',
  description: 'Chấm bài trắc nghiệm OMR bằng camera điện thoại',
  start_url: './',
  scope: './',
  display: 'standalone',
  orientation: 'portrait',
  background_color: '#ffffff',
  theme_color: '#f97316',
  lang: 'vi',
  icons: [
    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ]
}, null, 2));

// 3. thẻ trong index.html
let html = fs.readFileSync(indexPath, 'utf8');
if (!html.includes('manifest.webmanifest')) {
  const tags =
    '    <link rel="manifest" href="manifest.webmanifest">\n' +
    '    <link rel="apple-touch-icon" href="icons/apple-touch-icon.png">\n' +
    '    <meta name="apple-mobile-web-app-title" content="TNMaker">\n' +
    '    <meta name="mobile-web-app-capable" content="yes">\n';
  html = html.replace('</head>', tags + '</head>');
  const reg = `<script>if ('serviceWorker' in navigator) { window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); }); }</script>\n`;
  html = html.replace('</body>', reg + '</body>');
  fs.writeFileSync(indexPath, html);
}

// 4. service worker: lưu sẵn tất cả tệp trong www
const files = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name !== 'sw.js') files.push('./' + path.relative(www, p).split(path.sep).join('/'));
  }
})(www);
files.sort();
const hash = crypto.createHash('sha1');
for (const f of files) hash.update(f).update(fs.readFileSync(path.join(www, f)));
const version = hash.digest('hex').slice(0, 10);
fs.writeFileSync(path.join(www, 'sw.js'), `// tự sinh bởi scripts/prepare-pwa.mjs
const CACHE = 'tnmaker-${version}';
const FILES = ${JSON.stringify(['./'].concat(files), null, 2)};
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('tnmaker-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).catch(() => caches.match('./index.html'))));
});
`);
console.log('OK PWA: ' + files.length + ' tệp được lưu sẵn, phiên bản ' + version);
