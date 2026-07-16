# Production release

DataLicenses.org is a static Astro site hosted on Cloudflare Pages.

## Cloudflare Pages settings

- Repository: `nickmvincent/data-licenses`
- Production branch: `main`
- Root directory: `website`
- Build command: `npm run verify`
- Build output directory: `dist`
- Node version: 24.18.0
- Automatic production deployments: enabled after approved merges to `main`
- Preview deployments: enabled for pull requests

The repository includes `website/wrangler.toml`, `.nvmrc`, security headers,
immutable asset caching, and the complete verification workflow.

## Release checklist

- [ ] Content lint passes.
- [ ] Astro type check passes.
- [ ] Unit tests pass.
- [ ] Production build passes.
- [ ] Automated HTML accessibility scan passes.
- [ ] Internal link and fragment check passes.
- [ ] Draft/private visibility check passes.
- [ ] Archived profile and sitemap checks pass.
- [ ] Static performance budgets pass.
- [ ] Manual keyboard, screen-reader, theme, zoom, and mobile review is complete.
- [ ] Nick Vincent approves the production release.

## Rollback

Revert the faulty merge or commit in Git. Cloudflare Pages will build and
publish the restored production branch. If immediate rollback is needed before
the revert build completes, select the last known-good deployment in the
Cloudflare Pages dashboard, then still commit the Git revert so repository and
production state match.

## Monitoring and maintenance

No automated production monitoring or analytics are required. Dependabot
proposes dependency updates monthly. Current catalog profiles are reviewed on a
rolling basis and checked at least every three months.
