import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { workSchema } from './content/works-schema';

// Works are one JSON file each under src/content/works — the shape the
// `scrape:works` script writes and future batches append to (SPEC task 4.0/4.1).
// A file that violates `workSchema` fails the build with a validation error.
const works = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/works' }),
  schema: workSchema,
});

export const collections = { works };
