import fs from 'node:fs';
import path from 'node:path';
import { seoTargets } from './seo-targets.mjs';

const distRoot = path.resolve(process.cwd(), 'dist');
const legalRoutes = ['/aviso-legal/', '/cookies/', '/fuentes-metodologia/', '/privacidad/'];

function decodeHtml(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function textContent(html) {
  return decodeHtml(html)
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalize(value) {
  return value
    .normalize('NFD')
    .replace(/\p{Mark}/gu, '')
    .toLocaleLowerCase('es')
    .replaceAll('€', ' euros ')
    .replace(/(?<=\d)[.,](?=\d{3}\b)/g, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function routeFile(route) {
  return route === '/' ? path.join(distRoot, 'index.html') : path.join(distRoot, route.slice(1), 'index.html');
}

function matchValue(html, pattern) {
  return decodeHtml(html.match(pattern)?.[1] ?? '').trim();
}

function keywordCount(content, keyword) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...content.matchAll(new RegExp(`(?<![\\p{Letter}\\p{Number}])${escaped}(?![\\p{Letter}\\p{Number}])`, 'gu'))].length;
}

const failures = [];
const rows = [];
const builtPages = new Map();
function collectBuiltPages(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) collectBuiltPages(file);
    else if (entry.name.endsWith('.html')) {
      const relative = path.relative(distRoot, file).split(path.sep).join('/');
      const route = `/${relative.replace(/index\.html$/, '')}`;
      builtPages.set(route, fs.readFileSync(file, 'utf8'));
    }
  }
}
collectBuiltPages(distRoot);
const sitemapUrls = [...fs.readFileSync(path.join(distRoot, 'sitemap.xml'), 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)]
  .map((match) => match[1]);
const sitemapRoutes = new Set();
for (const url of sitemapUrls) {
  const parsed = new URL(url);
  const route = parsed.pathname;
  if (parsed.origin !== 'https://cifria.es' || parsed.search || parsed.hash) failures.push({ rule: 'sitemap-url', url });
  if (sitemapRoutes.has(route)) failures.push({ rule: 'sitemap-duplicate', route });
  sitemapRoutes.add(route);
  if (!builtPages.has(route)) failures.push({ rule: 'sitemap-missing-page', route });
}
for (const [route, html] of builtPages) {
  const noindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
  if (noindex && sitemapRoutes.has(route)) failures.push({ rule: 'sitemap-noindex', route });
  if (!noindex && !sitemapRoutes.has(route)) failures.push({ rule: 'sitemap-omitted-indexable', route });
}
const editorialParagraphs = new Map();
const editorialFaqSets = new Map();
let distinctEditorialRoutes = 0;

function trackSharedText(collection, text, route) {
  const key = normalize(text);
  if (!collection.has(key)) collection.set(key, { text, routes: new Set() });
  collection.get(key).routes.add(route);
}

if (seoTargets.length !== 95) failures.push({ rule: 'target-count', actual: seoTargets.length, expected: 95 });

for (const { href, primaryKeyword } of seoTargets) {
  const file = routeFile(href);
  if (!fs.existsSync(file)) {
    failures.push({ route: href, rule: 'missing-built-route' });
    continue;
  }

  const html = fs.readFileSync(file, 'utf8');
  const main = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? '';
  // Detect substantial copied paragraphs and complete FAQ sets in the editorial
  // templates. Short navigation labels and isolated shared answers are expected.
  // This catches exact repetition; usefulness still needs an editorial review.
  const hasDistinctEditorial = main.includes('seo-landing-page')
    || main.includes('blog-post-content')
    || /^\/(vivienda|prestamos|nomina|impuestos|coche|ahorro-inversion)\/$/.test(href);
  if (hasDistinctEditorial) {
    distinctEditorialRoutes++;
    for (const match of main.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
      const paragraph = textContent(match[1]);
      if (paragraph.split(/\s+/).length >= 35) trackSharedText(editorialParagraphs, paragraph, href);
    }
    const questions = [...main.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi)]
      .map((match) => textContent(match[1]));
    if (questions.length >= 3) trackSharedText(editorialFaqSets, questions.join(' | '), href);
  }
  const title = matchValue(html, /<title>([\s\S]*?)<\/title>/i);
  const description = matchValue(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const h1Matches = [...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  const h1 = textContent(h1Matches[0]?.[1] ?? '');
  const afterH1 = h1Matches[0] ? main.slice((h1Matches[0].index ?? 0) + h1Matches[0][0].length) : '';
  const firstParagraph = textContent(afterH1.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? '');
  const normalizedKeyword = normalize(primaryKeyword);
  const normalizedContent = normalize(textContent(main));
  const occurrences = keywordCount(normalizedContent, normalizedKeyword);
  const wordCount = textContent(main).match(/[\p{Letter}\p{Number}]+/gu)?.length ?? 0;
  const calculatorSections = [...main.matchAll(/<section\s+class="content-section prose">[\s\S]*?<\/section>/gi)].map((match) => match[0]).join(' ');
  const editorialWordCount = calculatorSections
    ? textContent(calculatorSections).match(/[\p{Letter}\p{Number}]+/gu)?.length ?? 0
    : wordCount;
  const faqCount = [...main.matchAll(/<details\b/gi)].length;
  const rules = {
    titleStartsWithKeyword: normalize(title).startsWith(normalizedKeyword),
    titleLength: title.length <= 60,
    descriptionLength: description.length >= 145 && description.length <= 155,
    descriptionKeyword: normalize(description).includes(normalizedKeyword),
    descriptionCta: description.endsWith('Descúbrelo aquí.'),
    oneH1: h1Matches.length === 1,
    h1Keyword: normalize(h1) === normalizedKeyword,
    firstParagraphKeyword: normalize(firstParagraph).includes(normalizedKeyword),
    keywordDensity: occurrences >= 3 && occurrences <= 6,
    minimumWords: editorialWordCount >= 300,
    minimumFaqs: faqCount >= 3,
  };

  rows.push({ route: href, keyword: primaryKeyword, occurrences, wordCount: editorialWordCount, faqCount });
  for (const [rule, passed] of Object.entries(rules)) {
    if (!passed) failures.push({ route: href, keyword: primaryKeyword, rule, occurrences, wordCount: editorialWordCount, faqCount, titleLength: title.length, descriptionLength: description.length });
  }
}

for (const route of legalRoutes) {
  const file = routeFile(route);
  const html = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const robots = matchValue(html, /<meta\s+name="robots"\s+content="([^"]*)"/i);
  if (!robots.includes('noindex')) failures.push({ route, rule: 'legal-noindex' });
}

for (const [rule, collection] of [
  ['repeatedEditorialParagraph', editorialParagraphs],
  ['repeatedEditorialFaqSet', editorialFaqSets],
]) {
  for (const { text, routes } of collection.values()) {
    if (routes.size > 1) failures.push({ rule, routes: [...routes], excerpt: text.slice(0, 180) });
  }
}

console.log(JSON.stringify({ auditedRoutes: rows.length, distinctEditorialRoutes, failures, pages: rows }, null, 2));
if (failures.length) process.exitCode = 1;
