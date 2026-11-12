// Biến src/index.html (đang dùng CDN) thành bản chạy OFFLINE trong www/:
//  - bỏ Tailwind CDN + cấu hình inline  -> dùng www/tailwind.css (biên dịch bằng Tailwind CLI)
//  - bỏ Google Fonts                    -> dùng font hệ thống (sans-serif / monospace / serif)
//  - Font Awesome CDN                   -> chép bản local từ node_modules vào www/fa
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const srcFile = path.join(root, 'src', 'index.html');
const outDir = path.join(root, 'www');

let html = fs.readFileSync(srcFile, 'utf8');
const before = html.length;

function mustReplace(re, to, label) {
  if (!re.test(html)) throw new Error('Không tìm thấy đoạn cần thay: ' + label);
  html = html.replace(re, to);
}

// 1. Tailwind CDN + khối cấu hình inline
mustReplace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/, '<link rel="stylesheet" href="tailwind.css">', 'Tailwind CDN');
mustReplace(/<script>\s*tailwind\.config\s*=[\s\S]*?<\/script>/, '', 'tailwind.config');

// 2. Google Fonts (preconnect + stylesheet nếu có)
html = html.replace(/<link[^>]*fonts\.g(oogleapis|static)\.com[^>]*>\s*/g, '');

// 3. Font Awesome
mustReplace(/<link[^>]*font-awesome[^>]*>/, '<link rel="stylesheet" href="fa/css/all.min.css">', 'Font Awesome CDN');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html);

// Chép Font Awesome (css + webfonts) vào www/fa
const faSrc = path.join(root, 'node_modules', '@fortawesome', 'fontawesome-free');
if (!fs.existsSync(faSrc)) throw new Error('Chưa cài @fortawesome/fontawesome-free (chạy npm install trước).');
fs.cpSync(path.join(faSrc, 'css', 'all.min.css'), path.join(outDir, 'fa', 'css', 'all.min.css'), { recursive: true });
fs.cpSync(path.join(faSrc, 'webfonts'), path.join(outDir, 'fa', 'webfonts'), { recursive: true });

console.log(`OK: www/index.html (${before} -> ${html.length} ký tự), đã chép Font Awesome.`);
