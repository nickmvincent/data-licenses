#!/usr/bin/env node

import { access, readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

import { load as loadYaml } from 'js-yaml';

const root = process.cwd();
const dist = resolve(root, 'dist');
const contentDir = resolve(root, '..', 'content', 'initiatives');
const errors = [];

const fail = (message) => errors.push(message);
const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

function parseMarkdownFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  return match ? loadYaml(match[1]) || {} : {};
}

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

function localTarget(pathname) {
  const clean = decodeURIComponent(pathname).replace(/^\/+/, '');
  const target = resolve(dist, clean);
  if (!target.startsWith(`${dist}${sep}`) && target !== dist) return null;
  if (!clean) return join(dist, 'index.html');
  if (extname(clean)) return target;
  return join(target, 'index.html');
}

function extractAttributes(html) {
  return Array.from(html.matchAll(/\b(?:href|src)=["']([^"'<>]+)["']/gi), (match) =>
    decodeHtml(match[1])
  );
}

function hasFragment(html, fragment) {
  const decoded = decodeURIComponent(fragment);
  const escaped = decoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b(?:id|name)=["']${escaped}["']`).test(html);
}

const allFiles = await walk(dist);
const htmlFiles = allFiles.filter((path) => path.endsWith('.html'));
const htmlByFile = new Map(
  await Promise.all(htmlFiles.map(async (path) => [path, await readFile(path, 'utf8')]))
);

for (const requiredPath of [
  '/',
  '/about',
  '/404.html',
  '/archive',
  '/contributing',
  '/data',
  '/glossary',
  '/methodology',
  '/updates',
]) {
  const target = localTarget(requiredPath);
  if (!target || !(await exists(target))) fail(`missing generated page: ${requiredPath}`);
}
for (const requiredAsset of ['_headers', 'social-card.png', 'social-card.svg', 'site.webmanifest']) {
  if (!(await exists(join(dist, requiredAsset)))) fail(`missing generated production asset: ${requiredAsset}`);
}

for (const [sourceFile, html] of htmlByFile) {
  for (const rawTarget of extractAttributes(html)) {
    if (
      !rawTarget ||
      rawTarget.startsWith('http://') ||
      rawTarget.startsWith('https://') ||
      rawTarget.startsWith('mailto:') ||
      rawTarget.startsWith('tel:') ||
      rawTarget.startsWith('data:')
    ) {
      continue;
    }

    const sourceRoute = `/${normalize(sourceFile.slice(dist.length, -'index.html'.length))
      .split(sep)
      .filter(Boolean)
      .join('/')}`;
    const parsed = new URL(rawTarget, `https://datalicenses.org${sourceRoute}`);
    const targetFile = localTarget(parsed.pathname);
    if (!targetFile || !(await exists(targetFile))) {
      fail(`${sourceFile.slice(dist.length + 1)} links to missing ${rawTarget}`);
      continue;
    }

    if (parsed.hash && targetFile.endsWith('.html')) {
      const targetHtml = htmlByFile.get(targetFile) ?? await readFile(targetFile, 'utf8');
      if (!hasFragment(targetHtml, parsed.hash.slice(1))) {
        fail(`${sourceFile.slice(dist.length + 1)} links to missing fragment ${rawTarget}`);
      }
    }
  }
}

const initiativeFiles = (await readdir(contentDir)).filter((file) => file.endsWith('.md'));
const records = [];
for (const file of initiativeFiles) {
  const raw = await readFile(join(contentDir, file), 'utf8');
  const data = parseMarkdownFrontmatter(raw);
  records.push({
    slug: file.replace(/\.md$/, ''),
    title: String(data.title || ''),
    visibility: String(data.visibility || ''),
    status: String(data.status || ''),
  });
}

const datasetPath = join(dist, 'data', 'initiatives.json');
const datasetRaw = await readFile(datasetPath, 'utf8');
const dataset = JSON.parse(datasetRaw);
if (dataset.schemaVersion !== '1.0') fail('public dataset is missing schemaVersion 1.0');
if (dataset.license?.identifier !== 'CC-BY-4.0') fail('public dataset is missing CC-BY-4.0 metadata');
if (!Array.isArray(dataset.items)) fail('public dataset items is not an array');
if (dataset.count !== dataset.items.length) fail('public dataset count does not match items');

const publicRecords = records.filter((record) => record.visibility === 'public');
const currentRecords = publicRecords.filter((record) => record.status !== 'archived');
const archivedRecords = publicRecords.filter((record) => record.status === 'archived');
const nonPublicRecords = records.filter((record) => record.visibility !== 'public');
const datasetSlugs = new Set(dataset.items.map((item) => item.slug));

for (const record of publicRecords) {
  if (!datasetSlugs.has(record.slug)) fail(`public dataset is missing ${record.slug}`);
}
for (const record of nonPublicRecords) {
  if (datasetSlugs.has(record.slug) || datasetRaw.includes(record.title)) {
    fail(`non-public record leaked into public dataset: ${record.slug}`);
  }
  if (await exists(join(dist, 'initiatives', record.slug, 'index.html'))) {
    fail(`non-public profile was generated: ${record.slug}`);
  }
}

const homepage = await readFile(join(dist, 'index.html'), 'utf8');
const notFound = await readFile(join(dist, '404.html'), 'utf8');
if (!/<meta name="robots" content="noindex, follow"\s*\/?>/.test(notFound)) {
  fail('404 page is missing noindex');
}
for (const record of currentRecords) {
  if (!homepage.includes(`/initiatives/${record.slug}`)) {
    fail(`current initiative is missing from server-rendered homepage catalog: ${record.slug}`);
  }
}
for (const record of archivedRecords) {
  const profilePath = join(dist, 'initiatives', record.slug, 'index.html');
  const profile = await readFile(profilePath, 'utf8');
  if (!/<meta name="robots" content="noindex, follow"\s*\/?>/.test(profile)) {
    fail(`archived profile is missing noindex: ${record.slug}`);
  }
}

const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
for (const record of archivedRecords) {
  if (sitemap.includes(`/initiatives/${record.slug}`)) {
    fail(`archived profile appears in sitemap: ${record.slug}`);
  }
}

for (const item of dataset.items) {
  for (const field of [
    'title',
    'summary',
    'body',
    'website',
    'status',
    'statusRationale',
    'primaryApproachType',
    'lastChecked',
    'lastModified',
  ]) {
    if (!item[field]) fail(`dataset item ${item.slug} is missing ${field}`);
  }
  if (!Array.isArray(item.pipelineStages) || item.pipelineStages.length === 0) {
    fail(`dataset item ${item.slug} has no pipeline stages`);
  }
  if (!Array.isArray(item.dataTypes) || item.dataTypes.length === 0) {
    fail(`dataset item ${item.slug} has no data types`);
  }
  if (item.status === 'archived' && !item.archiveReason) {
    fail(`archived dataset item ${item.slug} has no archive reason`);
  }
}

const allText = allFiles
  .filter((path) => /\.(?:html|js|json|xml|txt)$/.test(path))
  .map((path) => readFile(path, 'utf8'));
const combinedText = (await Promise.all(allText)).join('\n');
for (const forbidden of [
  'localStorage',
  'sessionStorage',
  'comparison-dialog',
  'data-compare=',
  'Browse and compare',
  'googletagmanager.com',
  'google-analytics.com',
  'plausible.io',
]) {
  if (combinedText.includes(forbidden)) fail(`generated site contains forbidden feature or storage token: ${forbidden}`);
}

const headers = await readFile(join(dist, '_headers'), 'utf8');
for (const requiredHeader of [
  'Content-Security-Policy:',
  'Permissions-Policy:',
  'Referrer-Policy:',
  'X-Content-Type-Options:',
  'X-Frame-Options:',
]) {
  if (!headers.includes(requiredHeader)) fail(`production headers are missing ${requiredHeader}`);
}

for (const schemaType of ['WebSite', 'Organization', 'Dataset', 'DefinedTermSet', 'BreadcrumbList', 'CreativeWork']) {
  if (!combinedText.includes(`"@type":"${schemaType}"`)) {
    fail(`generated site is missing structured data type ${schemaType}`);
  }
}

const clientJs = allFiles.filter((path) => path.endsWith('.js'));
const clientJsBytes = (
  await Promise.all(clientJs.map(async (path) => (await stat(path)).size))
).reduce((sum, size) => sum + size, 0);
if (clientJsBytes > 25_000) {
  fail(`client JavaScript exceeds 25 KB uncompressed (${clientJsBytes} bytes)`);
}
const homepageBytes = (await stat(join(dist, 'index.html'))).size;
if (homepageBytes > 500_000) {
  fail(`homepage HTML exceeds 500 KB (${homepageBytes} bytes)`);
}

if (errors.length > 0) {
  console.error(`Built-site check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Built-site check passed: ${htmlFiles.length} HTML pages, ${dataset.items.length} public records, ` +
  `${clientJsBytes} bytes of client JavaScript, no visibility leaks, and no broken internal links.`
);
