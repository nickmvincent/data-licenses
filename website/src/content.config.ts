import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const initiatives = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../content/initiatives' }),
  schema: z.object({
    title: z.string().describe('Display name of the initiative'),
    summary: z.string().describe('Short description for cards'),

    // Actions this project supports (tag-like)
    actionsSupported: z
      .array(
        z.enum([
          'attach-preference-signal',
          'attach-formal-license',
          'join-licensing-collective',
          'add-tollgate',
          'technical-blocking',
          'new-infrastructures',
          'certification',
        ])
      )
      .default([])
      .optional(),

    status: z
      .enum(['live', 'wip'])
      .describe('Project status'),
    website: z.string().url().describe('Canonical website for the initiative'),
    evidenceLinks: z
      .array(
        z.object({
          label: z.string().describe('Short label describing the evidence or update'),
          url: z.string().url().describe('Link to the announcement, docs page, news story, or other evidence'),
          date: z.coerce.date().describe('Date associated with the evidence link'),
        })
      )
      .default([])
      .optional(),
    jurisdictions: z.array(z.string()).default([]).optional(),
    signals: z.array(z.string()).default([]).optional(),
    pipelineStages: z
      .array(z.enum(['collect', 'train', 'fine-tune', 'retrieve', 'generate']))
      .default([])
      .optional(),
    considerations: z.string().optional().describe('Risks, tradeoffs, or caveats'),
    tags: z.array(z.string()).default([]).optional(),
    dependsOn: z
      .array(z.string())
      .default([])
      .optional()
      .describe('Slugs/ids of initiatives this depends on'),
    usersCount: z.string().optional().describe('Approximate number of users/adopters'),
    dataVolume: z.string().optional().describe('Amount of data flowing (e.g., pages/day, tokens, GB)'),
    moneyVolume: z.string().optional().describe('Payments/revenue flowing (e.g., $/month, $ total)'),
    implementationSnippets: z
      .array(
        z.object({
          title: z.string().describe('Short label for the snippet'),
          language: z.string().default('text').optional(),
          code: z.string().describe('Copy-pasteable code/config snippet'),
          sourceUrl: z.string().url().describe('Source link for the snippet'),
        })
      )
      .optional(),

    references: z
      .array(z.string())
      .default([])
      .optional()
      .describe('Citation keys from shared-references for related papers'),
  }),
});

export const collections = { initiatives };
