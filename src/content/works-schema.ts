// Single source of truth for a work's shape (SPEC: project-index). Defined with
// `astro/zod` — the exact zod instance Astro's content layer uses — so the same
// schema object validates the collection at build AND is unit-testable in vitest
// (where the `astro:content` virtual module does not resolve). The build-failure
// scenario ("invalid work rejected") is proven cheaply against this, not a build.

import { z } from 'astro/zod';

export const CATEGORIES = ['restaurant', 'hotel', 'music', 'vintage', 'books'] as const;

export const workSchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: z.enum(CATEGORIES),
  year: z.number().int(),
  /** Local committed stock photo under /works — never a hotlink or screenshot. */
  image: z.string(),
  summary: z.string(),
  /** Accent CSS colors the work-page grafts onto the kernel. Exempt from color law. */
  palette: z.array(z.string()).optional(),
  /** The signature mechanic distilled from the source, expressed through the kernel. */
  mechanic: z.string().optional(),
  /** Attribution only — never iframed, hotlinked, or linked out to. */
  source: z.string().optional(),
  /** True for live client services (smac); studies omit it. */
  real: z.boolean().optional(),
});

export type Work = z.infer<typeof workSchema>;
