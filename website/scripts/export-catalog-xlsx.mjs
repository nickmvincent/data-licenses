#!/usr/bin/env node

import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import { load as loadYaml } from 'js-yaml';

import {
  ADOPTION_METRIC_FIELDS,
  normalizeInitiativeFrontmatter,
  parseVisibility,
} from '../src/lib/content-schema.js';

const WEBSITE_ORIGIN = 'https://datalicenses.org';
const DEFAULT_CONTENT_DIR =
  process.env.DATA_LICENSES_CONTENT_DIR ||
  resolve(process.cwd(), '../content');
const DEFAULT_OUTPUT_PATH = resolve(process.cwd(), 'dist', 'data-licenses-catalog.xlsx');
const CURATION_PATH = resolve(process.cwd(), 'src/data/initiative-curation.json');

const ACTION_LABELS = {
  'attach-preference-signal': 'Preference signal',
  'attach-formal-license': 'Formal license',
  'join-licensing-collective': 'Licensing collective',
  'data-market-platform': 'Marketplace',
  'add-tollgate': 'Tollgate',
  'technical-blocking': 'Technical blocking',
  'rights-registry': 'Rights registry',
  'protocol-standard': 'Protocol or standard',
  'governed-data-sharing': 'Governed data sharing',
  certification: 'Certification',
};

const PIPELINE_LABELS = {
  collect: 'Collect',
  train: 'Train',
  'fine-tune': 'Fine-tune',
  evaluate: 'Evaluate',
  retrieve: 'Retrieve',
  generate: 'Generate',
};

const DATA_TYPE_LABELS = {
  'web-content': 'Web content',
  text: 'Text',
  images: 'Images',
  video: 'Video',
  audio: 'Audio',
  music: 'Music',
  code: 'Code',
  'structured-data': 'Structured data',
  multimodal: 'Multimodal',
};

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) return { data: {}, body: raw.trim() };

  return {
    data: loadYaml(match[1]) || {},
    body: raw.slice(match[0].length).trim(),
  };
}

function slugFromFilename(name) {
  return name.replace(/\.md$/i, '');
}

function joinList(values, formatter = (value) => value) {
  if (!Array.isArray(values) || values.length === 0) return '';
  return values.map((value) => formatter(value)).join(' | ');
}

function formatDate(value) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString().slice(0, 10);
}

function yesNo(value) {
  return value ? 'yes' : 'no';
}

function shortCitation(reference) {
  const firstAuthor = reference.authors[0]?.split(',')[0] || 'Unknown';
  const etAl = reference.authors.length > 1 ? ' et al.' : '';
  return `${firstAuthor}${etAl} (${reference.year})`;
}

async function ensureContentRoot() {
  const target = resolve(DEFAULT_CONTENT_DIR);
  try {
    await access(target);
    return target;
  } catch {
    const message = [
      'Could not find the content directory.',
      `Expected at: ${target}`,
      'Set DATA_LICENSES_CONTENT_DIR to override this path.',
    ].join(' ');
    throw new Error(message);
  }
}

async function loadCuration() {
  try {
    const raw = await readFile(CURATION_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function loadReferences(root) {
  const dir = join(root, 'shared-references', 'bibtex-entries');
  const references = new Map();

  try {
    const files = (await readdir(dir)).filter((file) => file.endsWith('.md'));
    for (const file of files) {
      const raw = await readFile(join(dir, file), 'utf8');
      const { data } = parseFrontmatter(raw);
      if (data.type !== 'bibtex_entry') continue;

      const citationKey = data.citation_key || slugFromFilename(file);
      references.set(citationKey, {
        citation_key: citationKey,
        entry_type: data.entry_type || 'misc',
        title: data.title || '',
        authors: Array.isArray(data.authors) ? data.authors : [],
        year: String(data.year || ''),
        venue: data.venue || '',
        url: data.url || '',
        doi: data.doi || '',
        abstract: data.abstract || '',
        pages: data.pages || '',
        booktitle: data.booktitle || '',
        journal: data.journal || '',
        semantic_scholar_url: data.semantic_scholar_url || '',
        google_scholar_url: data.google_scholar_url || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
      });
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }

  return references;
}

async function loadInitiatives(root, curationBySlug, referencesByKey) {
  const dir = join(root, 'initiatives');
  const files = (await readdir(dir)).filter((file) => file.endsWith('.md'));
  const items = [];

  for (const file of files) {
    const raw = await readFile(join(dir, file), 'utf8');
    const { data, body } = parseFrontmatter(raw);
    const context = `Initiative ${file}`;
    const frontmatter = normalizeInitiativeFrontmatter(data || {}, context);
    if (frontmatter.visibility !== 'public') continue;

    const slug = slugFromFilename(file);
    const missingReferences = frontmatter.references.filter((key) => !referencesByKey.has(key));
    if (missingReferences.length > 0) {
      throw new Error(
        `${context} references unknown citation key(s): ${missingReferences.join(', ')}`
      );
    }

    const resolvedReferences = frontmatter.references
      .map((key) => referencesByKey.get(key))
      .filter(Boolean);
    const evidenceLinks = frontmatter.evidenceLinks;
    const latestEvidenceLink = evidenceLinks[0];
    const adoptionMetricFields = ADOPTION_METRIC_FIELDS.filter((field) => {
      const value = frontmatter[field];
      return typeof value === 'string' && value.trim();
    });
    const hasAdoptionMetrics = adoptionMetricFields.length > 0;
    const metricEvidence = frontmatter.metricEvidence || {};
    const metricEvidenceFields = adoptionMetricFields.filter((field) => {
      const entry = metricEvidence[field];
      return Array.isArray(entry?.sources) && entry.sources.length > 0;
    });
    const hasMetricEvidence = metricEvidenceFields.length > 0;
    const metricEvidenceStatus = !hasAdoptionMetrics
      ? 'not-applicable'
      : metricEvidenceFields.length === adoptionMetricFields.length
        ? 'sourced'
        : hasMetricEvidence
          ? 'partial'
          : 'missing';
    const curation = curationBySlug[slug] || {};
    const evidenceStatus = evidenceLinks.length > 0 ? 'tracked' : 'needs-sourcing';
    const adoptionResearchStatus =
      curation.adoptionResearchStatus || (hasAdoptionMetrics ? 'populated' : 'needs-research');

    items.push({
      id: frontmatter.id || slug,
      slug,
      title: frontmatter.title,
      summary: frontmatter.summary,
      body,
      website: frontmatter.website,
      actionsSupported: frontmatter.actionsSupported,
      primaryApproachType: frontmatter.primaryApproachType,
      jurisdictions: frontmatter.jurisdictions,
      signals: frontmatter.signals,
      pipelineStages: frontmatter.pipelineStages,
      dataTypes: frontmatter.dataTypes,
      operator: frontmatter.operator || '',
      launchDate: frontmatter.launchDate || null,
      availability: frontmatter.availability || '',
      pricing: frontmatter.pricing || '',
      openSourceStatus: frontmatter.openSourceStatus || '',
      softwareLicense: frontmatter.softwareLicense || '',
      rightsContact: frontmatter.rightsContact || '',
      integrations: frontmatter.integrations,
      related: frontmatter.related,
      statusRationale: frontmatter.statusRationale || '',
      archiveReason: frontmatter.archiveReason || '',
      successor: frontmatter.successor || '',
      considerations: frontmatter.considerations || '',
      tags: frontmatter.tags,
      dependsOn: frontmatter.dependsOn,
      usersCount: frontmatter.usersCount || '',
      dataVolume: frontmatter.dataVolume || '',
      moneyVolume: frontmatter.moneyVolume || '',
      metricEvidence,
      implementationSnippets: frontmatter.implementationSnippets || [],
      references: frontmatter.references,
      referencesResolved: resolvedReferences,
      status: frontmatter.status,
      evidenceLinks,
      latestEvidenceLink,
      latestUpdate: latestEvidenceLink?.date || null,
      evidenceStatus,
      hasAdoptionMetrics,
      adoptionMetricFields,
      hasMetricEvidence,
      metricEvidenceFields,
      metricEvidenceStatus,
      adoptionResearchStatus,
      adoptionResearchNotes: curation.adoptionResearchNotes || '',
    });
  }

  return items.sort((a, b) => a.title.localeCompare(b.title));
}

async function loadPage(root, slug) {
  const raw = await readFile(join(root, 'pages', `${slug}.md`), 'utf8');
  const { data, body } = parseFrontmatter(raw);
  const context = `Page ${slug}.md`;
  const visibility = parseVisibility(data?.visibility, context);
  if (visibility !== 'public') return null;

  return {
    kind: 'page',
    slug,
    title: data?.title || slug,
    description: data?.description || '',
    url: `${WEBSITE_ORIGIN}/${slug}/`,
    body,
  };
}

function buildSheets(initiatives, siteContent) {
  const initiativeRows = initiatives.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    catalogUrl: `${WEBSITE_ORIGIN}/initiatives/${item.slug}/`,
    website: item.website,
    summary: item.summary,
    body: item.body,
    status: item.status,
    actionsSupported: joinList(item.actionsSupported),
    actionLabels: joinList(item.actionsSupported, (action) => ACTION_LABELS[action] || action),
    primaryApproachType: item.primaryApproachType,
    primaryApproachLabel: ACTION_LABELS[item.primaryApproachType] || item.primaryApproachType,
    jurisdictions: joinList(item.jurisdictions),
    signals: joinList(item.signals),
    pipelineStages: joinList(item.pipelineStages),
    pipelineLabels: joinList(item.pipelineStages, (stage) => PIPELINE_LABELS[stage] || stage),
    dataTypes: joinList(item.dataTypes),
    dataTypeLabels: joinList(item.dataTypes, (type) => DATA_TYPE_LABELS[type] || type),
    operator: item.operator,
    launchDate: formatDate(item.launchDate),
    availability: item.availability,
    pricing: item.pricing,
    openSourceStatus: item.openSourceStatus,
    softwareLicense: item.softwareLicense,
    rightsContact: item.rightsContact,
    integrations: joinList(item.integrations),
    related: joinList(item.related),
    statusRationale: item.statusRationale,
    archiveReason: item.archiveReason,
    successor: item.successor,
    tags: joinList(item.tags),
    dependsOn: joinList(item.dependsOn),
    considerations: item.considerations,
    latestUpdate: formatDate(item.latestUpdate),
    latestEvidenceLabel: item.latestEvidenceLink?.label || '',
    latestEvidenceUrl: item.latestEvidenceLink?.url || '',
    evidenceStatus: item.evidenceStatus,
    evidenceLinkCount: String(item.evidenceLinks.length),
    usersCount: item.usersCount,
    dataVolume: item.dataVolume,
    moneyVolume: item.moneyVolume,
    hasAdoptionMetrics: yesNo(item.hasAdoptionMetrics),
    adoptionMetricFields: joinList(item.adoptionMetricFields),
    hasMetricEvidence: yesNo(item.hasMetricEvidence),
    metricEvidenceFields: joinList(item.metricEvidenceFields),
    metricEvidenceStatus: item.metricEvidenceStatus,
    adoptionResearchStatus: item.adoptionResearchStatus,
    adoptionResearchNotes: item.adoptionResearchNotes,
    referenceKeys: joinList(item.references),
    referenceCount: String(item.referencesResolved.length),
    implementationSnippetCount: String(item.implementationSnippets.length),
  }));

  const evidenceRows = initiatives.flatMap((item) =>
    item.evidenceLinks.map((link, index) => ({
      initiativeSlug: item.slug,
      initiativeTitle: item.title,
      latestForInitiative: yesNo(index === 0),
      label: link.label,
      date: formatDate(link.date),
      url: link.url,
    }))
  );

  const metricEvidenceRows = initiatives.flatMap((item) =>
    ADOPTION_METRIC_FIELDS.flatMap((field) => {
      const entry = item.metricEvidence?.[field];
      if (!entry) return [];

      return entry.sources.map((source) => ({
        initiativeSlug: item.slug,
        initiativeTitle: item.title,
        metric: field,
        metricValue: item[field] || '',
        basis: entry.basis || '',
        notes: entry.notes || '',
        sourceLabel: source.label,
        sourceDate: formatDate(source.date),
        sourceUrl: source.url,
      }));
    })
  );

  const referenceRows = initiatives.flatMap((item) =>
    item.referencesResolved.map((reference) => ({
      initiativeSlug: item.slug,
      initiativeTitle: item.title,
      citationKey: reference.citation_key,
      shortCitation: shortCitation(reference),
      entryType: reference.entry_type,
      title: reference.title,
      authors: joinList(reference.authors),
      year: reference.year,
      venue: reference.venue,
      journal: reference.journal,
      booktitle: reference.booktitle,
      pages: reference.pages,
      url: reference.url,
      doi: reference.doi,
      semanticScholarUrl: reference.semantic_scholar_url,
      googleScholarUrl: reference.google_scholar_url,
      tags: joinList(reference.tags),
      abstract: reference.abstract,
    }))
  );

  const implementationRows = initiatives.flatMap((item) =>
    item.implementationSnippets.map((snippet) => ({
      initiativeSlug: item.slug,
      initiativeTitle: item.title,
      title: snippet.title,
      summary: snippet.summary || '',
      language: snippet.language || '',
      sourceUrl: snippet.sourceUrl,
      exampleLabel: snippet.exampleLabel || '',
      exampleUrl: snippet.exampleUrl || '',
      code: snippet.code,
    }))
  );

  const pageRows = siteContent
    .filter(Boolean)
    .map((page) => ({
      kind: page.kind,
      slug: page.slug,
      title: page.title,
      url: page.url,
      description: page.description,
      body: page.body,
    }));

  const summaryRows = [
    {
      generatedAt: new Date().toISOString(),
      initiatives: String(initiativeRows.length),
      evidenceLinks: String(evidenceRows.length),
      metricEvidenceRows: String(metricEvidenceRows.length),
      referenceRows: String(referenceRows.length),
      implementationSnippets: String(implementationRows.length),
      sitePages: String(pageRows.length),
    },
  ];

  return [
    { name: 'Summary', rows: rowsFromObjects(summaryRows) },
    { name: 'Initiatives', rows: rowsFromObjects(initiativeRows) },
    { name: 'Evidence Links', rows: rowsFromObjects(evidenceRows) },
    { name: 'Metric Evidence', rows: rowsFromObjects(metricEvidenceRows) },
    { name: 'References', rows: rowsFromObjects(referenceRows) },
    { name: 'Implementation', rows: rowsFromObjects(implementationRows) },
    { name: 'Site Content', rows: rowsFromObjects(pageRows) },
  ];
}

function rowsFromObjects(items) {
  if (!items.length) return [['empty']];

  const columns = [];
  const seen = new Set();
  for (const item of items) {
    for (const key of Object.keys(item)) {
      if (seen.has(key)) continue;
      seen.add(key);
      columns.push(key);
    }
  }

  const rows = [columns];
  for (const item of items) {
    rows.push(columns.map((column) => String(item[column] ?? '')));
  }

  return rows;
}

function columnName(index) {
  let value = index + 1;
  let name = '';
  while (value > 0) {
    const remainder = (value - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    value = Math.floor((value - 1) / 26);
  }
  return name;
}

function escapeXml(value) {
  return String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function sheetXml(rows) {
  const maxColumns = Math.max(...rows.map((row) => row.length), 1);
  const lastCell = `${columnName(maxColumns - 1)}${rows.length}`;
  const rowXml = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((value, columnIndex) => {
          const ref = `${columnName(columnIndex)}${rowIndex + 1}`;
          return [
            `<c r="${ref}" s="0" t="inlineStr">`,
            '<is>',
            `<t xml:space="preserve">${escapeXml(value)}</t>`,
            '</is>',
            '</c>',
          ].join('');
        })
        .join('');

      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join('');

  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">',
    `<dimension ref="A1:${lastCell}"/>`,
    '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A2" sqref="A2"/></sheetView></sheetViews>',
    '<sheetFormatPr defaultRowHeight="15"/>',
    `<sheetData>${rowXml}</sheetData>`,
    `<autoFilter ref="A1:${lastCell}"/>`,
    '</worksheet>',
  ].join('');
}

function workbookXml(sheets) {
  const sheetEntries = sheets
    .map(
      (sheet, index) =>
        `<sheet name="${escapeXml(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`
    )
    .join('');

  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">',
    `<sheets>${sheetEntries}</sheets>`,
    '</workbook>',
  ].join('');
}

function workbookRelsXml(sheets) {
  const sheetRelationships = sheets
    .map(
      (_sheet, index) =>
        `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`
    )
    .join('');
  const stylesRelationship = `<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>`;

  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    sheetRelationships,
    stylesRelationship,
    '</Relationships>',
  ].join('');
}

function contentTypesXml(sheets) {
  const sheetOverrides = sheets
    .map(
      (_sheet, index) =>
        `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
    )
    .join('');

  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
    '<Default Extension="xml" ContentType="application/xml"/>',
    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>',
    '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>',
    '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>',
    '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>',
    sheetOverrides,
    '</Types>',
  ].join('');
}

function rootRelsXml() {
  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>',
    '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>',
    '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>',
    '</Relationships>',
  ].join('');
}

function stylesXml() {
  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
    '<fonts count="1"><font><sz val="11"/><name val="Calibri"/><family val="2"/></font></fonts>',
    '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>',
    '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>',
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>',
    '<cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf></cellXfs>',
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>',
    '</styleSheet>',
  ].join('');
}

function corePropsXml(timestamp) {
  const iso = timestamp.toISOString();
  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
    '<dc:title>DataLicenses catalog export</dc:title>',
    '<dc:creator>Codex</dc:creator>',
    '<cp:lastModifiedBy>Codex</cp:lastModifiedBy>',
    `<dcterms:created xsi:type="dcterms:W3CDTF">${iso}</dcterms:created>`,
    `<dcterms:modified xsi:type="dcterms:W3CDTF">${iso}</dcterms:modified>`,
    '</cp:coreProperties>',
  ].join('');
}

function appPropsXml(sheets) {
  const titles = sheets.map((sheet) => `<vt:lpstr>${escapeXml(sheet.name)}</vt:lpstr>`).join('');
  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">',
    '<Application>Codex</Application>',
    '<HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>',
    String(sheets.length),
    '</vt:i4></vt:variant></vt:vector></HeadingPairs>',
    `<TitlesOfParts><vt:vector size="${sheets.length}" baseType="lpstr">${titles}</vt:vector></TitlesOfParts>`,
    '</Properties>',
  ].join('');
}

function buildWorkbookEntries(sheets) {
  const timestamp = new Date();
  const entries = [
    { name: '[Content_Types].xml', data: contentTypesXml(sheets) },
    { name: '_rels/.rels', data: rootRelsXml() },
    { name: 'docProps/core.xml', data: corePropsXml(timestamp) },
    { name: 'docProps/app.xml', data: appPropsXml(sheets) },
    { name: 'xl/workbook.xml', data: workbookXml(sheets) },
    { name: 'xl/_rels/workbook.xml.rels', data: workbookRelsXml(sheets) },
    { name: 'xl/styles.xml', data: stylesXml() },
  ];

  sheets.forEach((sheet, index) => {
    entries.push({
      name: `xl/worksheets/sheet${index + 1}.xml`,
      data: sheetXml(sheet.rows),
    });
  });

  return entries;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosTime(date) {
  return (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
}

function dosDate(date) {
  return ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
}

function zipStored(entries) {
  const fileParts = [];
  const centralDirectory = [];
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.name, 'utf8');
    const data = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(entry.data, 'utf8');
    const modifiedAt = new Date();
    const compressedSize = data.length;
    const checksum = crc32(data);

    const localHeader = Buffer.alloc(30 + name.length);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(dosTime(modifiedAt), 10);
    localHeader.writeUInt16LE(dosDate(modifiedAt), 12);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(compressedSize, 18);
    localHeader.writeUInt32LE(compressedSize, 22);
    localHeader.writeUInt16LE(name.length, 26);
    localHeader.writeUInt16LE(0, 28);
    name.copy(localHeader, 30);

    fileParts.push(localHeader, data);

    const centralHeader = Buffer.alloc(46 + name.length);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(dosTime(modifiedAt), 12);
    centralHeader.writeUInt16LE(dosDate(modifiedAt), 14);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(compressedSize, 20);
    centralHeader.writeUInt32LE(compressedSize, 24);
    centralHeader.writeUInt16LE(name.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    name.copy(centralHeader, 46);

    centralDirectory.push(centralHeader);
    offset += localHeader.length + data.length;
  }

  const centralSize = centralDirectory.reduce((sum, part) => sum + part.length, 0);
  const endRecord = Buffer.alloc(22);
  endRecord.writeUInt32LE(0x06054b50, 0);
  endRecord.writeUInt16LE(0, 4);
  endRecord.writeUInt16LE(0, 6);
  endRecord.writeUInt16LE(entries.length, 8);
  endRecord.writeUInt16LE(entries.length, 10);
  endRecord.writeUInt32LE(centralSize, 12);
  endRecord.writeUInt32LE(offset, 16);
  endRecord.writeUInt16LE(0, 20);

  return Buffer.concat([...fileParts, ...centralDirectory, endRecord]);
}

async function main() {
  const contentRoot = await ensureContentRoot();
  const outputPath = resolve(process.cwd(), process.argv[2] || DEFAULT_OUTPUT_PATH);
  const curation = await loadCuration();
  const references = await loadReferences(contentRoot);
  const initiatives = await loadInitiatives(contentRoot, curation, references);
  const siteContent = await Promise.all([
    loadPage(contentRoot, 'methodology'),
  ]);
  const sheets = buildSheets(initiatives, siteContent);
  const workbook = zipStored(buildWorkbookEntries(sheets));

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, workbook);

  console.log(
    `Wrote ${outputPath} with ${initiatives.length} initiatives across ${sheets.length} worksheet tabs.`
  );
}

main().catch((error) => {
  console.error(error?.stack || error?.message || String(error));
  process.exit(1);
});
