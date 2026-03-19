import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { parseFrontmatter, slugFromFilename } from './markdown';

export interface Reference {
  citation_key: string;
  entry_type: string;
  title: string;
  authors: string[];
  year: string;
  venue?: string;
  url?: string;
  doi?: string;
  abstract?: string;
  pages?: string;
  booktitle?: string;
  journal?: string;
  semantic_scholar_url?: string;
  google_scholar_url?: string;
  tags?: string[];
  [key: string]: unknown;
}

// During Astro build, import.meta.dirname points to dist/chunks, so we need
// a more robust path resolution. We try multiple strategies:
function resolveSharedRefsPath(): string {
  // Strategy 1: Environment variable (most explicit)
  if (process.env.SHARED_REFS_PATH) {
    return process.env.SHARED_REFS_PATH;
  }

  // Strategy 2: Navigate from process.cwd() (works during website builds)
  // Website builds run from website/, content is at ../content
  const fromCwd = path.resolve(process.cwd(), '../content/shared-references');
  if (existsSync(fromCwd)) {
    return fromCwd;
  }

  // Strategy 3: Try from import.meta.dirname (works in dev/non-bundled context)
  const fromMeta = path.resolve(
    import.meta.dirname ?? __dirname,
    '../content/shared-references'
  );

  return fromMeta;
}

const SHARED_REFS_PATH = resolveSharedRefsPath();

let cachedReferences: Map<string, Reference> | null = null;

export async function loadReferences(options: { force?: boolean; basePath?: string } = {}): Promise<Map<string, Reference>> {
  if (cachedReferences && !options.force && !options.basePath) {
    return cachedReferences;
  }

  const baseRefsPath = options.basePath || SHARED_REFS_PATH;
  // Bibtex entries live in the bibtex-entries subdirectory
  const refsPath = path.join(baseRefsPath, 'bibtex-entries');
  const refs = new Map<string, Reference>();

  try {
    const files = await readdir(refsPath);

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const filePath = path.join(refsPath, file);
      const content = await readFile(filePath, 'utf-8');
      const { data } = parseFrontmatter(content);

      if (data.type !== 'bibtex_entry') continue;

      const ref: Reference = {
        citation_key: data.citation_key || slugFromFilename(file),
        entry_type: data.entry_type || 'misc',
        title: data.title || '',
        authors: Array.isArray(data.authors) ? data.authors : [],
        year: String(data.year || ''),
        venue: data.venue,
        url: data.url,
        doi: data.doi,
        abstract: data.abstract,
        pages: data.pages,
        booktitle: data.booktitle,
        journal: data.journal,
        semantic_scholar_url: data.semantic_scholar_url,
        google_scholar_url: data.google_scholar_url,
        tags: data.tags,
      };

      // Copy any additional fields
      for (const [key, value] of Object.entries(data)) {
        if (!(key in ref)) {
          ref[key] = value;
        }
      }

      refs.set(ref.citation_key, ref);
    }
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== 'ENOENT') {
      throw error;
    }
  }

  cachedReferences = refs;
  return refs;
}

export function formatCitation(ref: Reference, style: 'apa' | 'short' = 'short'): string {
  if (style === 'short') {
    const firstAuthor = ref.authors[0]?.split(',')[0] || 'Unknown';
    const etAl = ref.authors.length > 1 ? ' et al.' : '';
    return `${firstAuthor}${etAl} (${ref.year})`;
  }

  // APA-ish format
  const authors = ref.authors.join(', ');
  return `${authors} (${ref.year}). ${ref.title}. ${ref.venue || ref.journal || ref.booktitle || ''}`;
}
