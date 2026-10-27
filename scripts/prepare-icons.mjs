import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
const source = await readFile('public/brand.svg');
await mkdir('public/icons', { recursive: true });
for (const [name, size] of [['favicon-32', 32], ['apple-touch-icon', 180], ['icon-192', 192], ['icon-512', 512]]) {
  await sharp(source).resize(size, size).png().toFile(`public/icons/${name}.png`);
}
const entries = await Promise.all([16, 32, 48].map(size => sharp(source).resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + entries.length * 16);
header.writeUInt16LE(1, 2); header.writeUInt16LE(entries.length, 4);
let offset = header.length;
entries.forEach((png, i) => {
  const at = 6 + i * 16;
  header[at] = [16, 32, 48][i]; header[at + 1] = header[at];
  header.writeUInt16LE(1, at + 4); header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(png.length, at + 8); header.writeUInt32LE(offset, at + 12);
  offset += png.length;
});
await writeFile('public/favicon.ico', Buffer.concat([header, ...entries]));
await writeFile('public/site.webmanifest', JSON.stringify({
  name: 'Ева Мэй', short_name: 'Ева Мэй', start_url: '/', display: 'standalone',
  theme_color: '#fce7f3', background_color: '#fff0f5',
  icons: [192, 512].map(size => ({ src: `/icons/icon-${size}.png?v=3`, sizes: `${size}x${size}`, type: 'image/png', purpose: 'any' })),
}));
