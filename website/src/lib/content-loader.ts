import { promises as fs } from 'node:fs';
import { join, resolve } from 'node:path';

import { parseFrontmatter, slugFromFilename } from '../../../helpers/markdown';
import { loadReferences } from '../../../helpers/shared-references';

const DEFAULT_CONTENT_DIR =
  process.env.DATA_LICENSES_CONTENT_DIR ||
  // Default to standalone repo layout: website -> ../content
  resolve(process.cwd(), '../content');

function coerceDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const d = new Date(String(value));
  return isNaN(d.getTime()) ? undefined : d;
}

function normalizeStatus(value: unknown): 'live' | 'wip' {
  const normalized = String(value || '').trim().toLowerCase();
  if (String(value || '').trim() === 'WIP') return 'wip';
  if (normalized === 'wip' || normalized === 'w.i.p.' || normalized === 'wip.') return 'wip';
  return 'live';
}

function cleanLegacyEvidenceLabel(value: unknown): string {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return 'Latest update';
  const withoutUrl = text.replace(/\s*\(https?:\/\/[^)]+\)\s*$/, '').trim();
  return withoutUrl || 'Latest update';
}

function extractUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const match = value.match(/https?:\/\/[^\s)]+/);
  return match ? match[0] : undefined;
}

function normalizeEvidenceLinks(data: Record<string, unknown>) {
  const rawLinks = Array.isArray(data.evidenceLinks) ? data.evidenceLinks : [];
  const normalized = rawLinks
    .map((link) => {
      if (!link || typeof link !== 'object') return null;
      const url = typeof link.url === 'string' ? link.url : '';
      const label = typeof link.label === 'string' ? link.label : '';
      const date = coerceDate((link as Record<string, unknown>).date);
      if (!url || !date) return null;
      return { label: label || 'Evidence link', url, date };
    })
    .filter(Boolean) as Array<{ label: string; url: string; date: Date }>;

  if (normalized.length === 0) {
    const legacyDate = coerceDate(data.recentActivity) || coerceDate(data.lastUpdated);
    const legacyUrl =
      (typeof data.linkWithEvidenceOfUse === 'string' && data.linkWithEvidenceOfUse) ||
      (typeof data.pressPage === 'string' && data.pressPage) ||
      extractUrl(data.recentActivityNote) ||
      (typeof data.website === 'string' && data.website) ||
      undefined;

    if (legacyDate && legacyUrl) {
      normalized.push({
        label: cleanLegacyEvidenceLabel(data.recentActivityNote),
        url: legacyUrl,
        date: legacyDate,
      });
    }
  }

  return normalized.sort((a, b) => b.date.getTime() - a.date.getTime());
}

async function ensureContentRoot(): Promise<string> {
  const target = resolve(DEFAULT_CONTENT_DIR);
  try {
    await fs.access(target);
    return target;
  } catch (err) {
    const msg = [
      'Could not find external content directory.',
      `Expected at: ${target}`,
      'Set DATA_LICENSES_CONTENT_DIR to override this path.',
    ].join(' ');
    throw new Error(msg);
  }
}

export async function loadInitiatives() {
  const root = await ensureContentRoot();
  const dir = join(root, 'initiatives');
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.md'));
  const allReferences = await loadReferences();

  const items = [];
  for (const file of files) {
    const raw = await fs.readFile(join(dir, file), 'utf8');
    const { data } = parseFrontmatter(raw);

    if (data?.visibility && data.visibility !== 'public') continue;
    if (data?.type && data.type !== 'data_license_initiative') continue;

    const referenceKeys = Array.isArray(data?.references)
      ? data.references.filter((k) => typeof k === 'string')
      : [];
    const resolvedReferences = referenceKeys
      .map((key) => allReferences.get(key))
      .filter(Boolean);

    const slug = slugFromFilename(file);
    const {
      evidenceLinks: _rawEvidenceLinks,
      recentActivity: _recentActivity,
      recentActivityNote: _recentActivityNote,
      lastUpdated: _lastUpdated,
      pressPage: _pressPage,
      linkWithEvidenceOfUse: _linkWithEvidenceOfUse,
      sourceRepo: _sourceRepo,
      spec: _spec,
      url: _url,
      ...rest
    } = data || {};
    const evidenceLinks = normalizeEvidenceLinks(data || {});
    const latestEvidenceLink = evidenceLinks[0];

    items.push({
      id: data.id || slug,
      slug,
      ...rest,
      references: referenceKeys,
      referencesResolved: resolvedReferences,
      status: normalizeStatus(data?.status),
      evidenceLinks,
      latestEvidenceLink,
      latestUpdate: latestEvidenceLink?.date,
    });
  }

  return items;
}

export async function loadMemo(slug = 'memo') {
  const root = await ensureContentRoot();
  const filePath = join(root, 'memos', `${slug}.md`);
  const raw = await fs.readFile(filePath, 'utf8');
  const { data, body } = parseFrontmatter(raw);

  if (data?.visibility && data.visibility !== 'public') {
    throw new Error(`Memo ${slug} is not marked public (visibility: ${data.visibility})`);
  }
  if (data?.type && data.type !== 'data_license_memo') {
    throw new Error(`Memo ${slug} has unexpected type: ${data.type}`);
  }

  return { slug, frontmatter: data, body };
}

export async function loadContentMeta() {
  const root = await ensureContentRoot();
  return { root };
}

export { loadReferences, loadReferencesByKeys, formatCitation } from '../../../helpers/shared-references';
