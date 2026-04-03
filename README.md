# data-licenses

Standalone home for datalicenses.org content and website.

## Structure

- `content/` markdown content (`initiatives/`, `memos/`)
- `website/` Astro site
- `helpers/` shared helper utilities/components used by the site

## Local Build

```bash
cd website
npm install
npm run build
```

## Spreadsheet Export

```bash
cd website
npm run export:xlsx
```

This writes `website/dist/data-licenses-catalog.xlsx`, a multi-sheet workbook you can upload to Google Drive and share as a spreadsheet view.
