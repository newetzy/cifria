import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const destination = path.join(process.env.USERPROFILE ?? 'C:\\Users\\Carlos', 'Desktop', 'cifria-url-keywords-actualizado.csv');
const mojibake = /Ã|Â|â/;

function clean(value) {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function csv(value) {
  return `"${value.replaceAll('"', '""')}"`;
}

const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const rows = urls.map((url) => {
  const pathname = new URL(url).pathname;
  const file = pathname === '/' ? path.join(dist, 'index.html') : path.join(dist, pathname, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  if (mojibake.test(html)) throw new Error(`Mojibake detectado en ${file}`);
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  if (!h1) throw new Error(`No se encontró H1 para ${url}`);
  const keyword = clean(h1);
  if (mojibake.test(keyword)) throw new Error(`Mojibake detectado en el H1 de ${url}`);
  return `${csv(url)};${csv(keyword)}`;
});

fs.writeFileSync(destination, `\uFEFFURL;Keyword principal\r\n${rows.join('\r\n')}\r\n`, 'utf8');
console.log(`Exportadas ${rows.length} URLs UTF-8 en ${destination}`);
