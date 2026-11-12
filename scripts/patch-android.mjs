// Chạy sau `npx cap add android`: cấp quyền camera cho ứng dụng và khóa chiều dọc.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const manifestPath = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
let xml = fs.readFileSync(manifestPath, 'utf8');

if (!xml.includes('android.permission.CAMERA')) {
  const perms =
    '    <uses-permission android:name="android.permission.CAMERA" />\n' +
    '    <uses-feature android:name="android.hardware.camera" android:required="false" />\n' +
    '    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />\n';
  if (!xml.includes('<application')) throw new Error('AndroidManifest.xml không có thẻ <application>');
  xml = xml.replace('<application', perms + '\n    <application');
}

if (!xml.includes('android:screenOrientation')) {
  xml = xml.replace(/<activity\b/, '<activity\n            android:screenOrientation="portrait"');
}

fs.writeFileSync(manifestPath, xml);
console.log('Đã cấp quyền CAMERA và khóa chiều dọc trong AndroidManifest.xml');
