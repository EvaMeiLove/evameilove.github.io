import { readdir, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const output = 'public/_images';
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const manifest = {};
async function visit(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) { await visit(file); continue; }
    if (!/\.(jpe?g|png|webp|avif)$/i.test(item.name)) continue;
    const source = await readFile(file);
    const hash = createHash('sha256').update(source).digest('hex').slice(0, 16);
    const metadata = await sharp(source).rotate().metadata();
    const rotated = [5, 6, 7, 8].includes(metadata.orientation);
    const width = rotated ? metadata.height : metadata.width;
    const height = rotated ? metadata.width : metadata.height;
    const widths = [...new Set([320, 640, 1280, 1920].map(w => Math.min(w, width)))];
    const variants = [];
    for (const size of widths) {
      const name = `${hash}-${size}.webp`;
      const info = await sharp(source).rotate().resize({ width: size, withoutEnlargement: true })
        .webp({ quality: 78, effort: 5 }).toFile(path.join(output, name));
      variants.push({ src: `/_images/${name}`, width: info.width, bytes: info.size });
    }
    const preview = await sharp(source).rotate().resize({ width: 16 }).webp({ quality: 35 }).toBuffer();
    manifest['/' + file.replaceAll(path.sep, '/').replace(/^public\//, '')] = {
      width, height, variants, preview: `data:image/webp;base64,${preview.toString('base64')}`,
    };
    console.log(`${file}: ${source.length} B → preview ${variants[0].bytes} B; full ${variants.at(-1).bytes} B`);
  }
}
await visit('public/images');
await mkdir('src/generated', { recursive: true });
await writeFile('src/generated/images.json', JSON.stringify(manifest));
