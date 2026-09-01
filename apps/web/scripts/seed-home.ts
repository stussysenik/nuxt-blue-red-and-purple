/**
 * Seed script: create the singleton home page in Sanity.
 * Matches the content of the live Astro site (src/pages/index.astro).
 *
 * Usage:
 *   cd apps/web
 *   SANITY_API_WRITE_TOKEN=your-write-token node --import tsx scripts/seed-home.ts
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NUXT_SANITY_PROJECT_ID || 'lkyz5ssa',
  dataset: process.env.NUXT_SANITY_DATASET || 'production',
  apiVersion: '2026-05-15',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

if (!process.env.SANITY_API_WRITE_TOKEN) {
  console.error('Missing SANITY_API_WRITE_TOKEN')
  process.exit(1)
}

async function seed() {
  // Check if home document exists
  const existing = await client.fetch(`*[_type == "home"][0]`)
  if (existing) {
    console.log('Home document already exists. Skipping.')
    process.exit(0)
  }

  const home = {
    _type: 'home',
    tagline: 'Too much blue will never amount to any red',
    aboutDescription:
      'We are a multi-disciplinary design communication studio that connects the unconnected by creating coherent and intuitive design. Every great idea begins with something fragile. Whether an idea is just at the beginning, taking shape, or ready to scale, we partner with our clients to build thoughtful work that feel intuitive, memorable and true to your vision.',
    formula: [
      { step: '–1 → 0', description: 'Discovering possibilities through curiosity, research, and brainstorming.' },
      { step: '0 → 1', description: 'Bringing ideas to life through thoughtful design and technology.' },
      { step: '1+', description: 'Helping brands grow through continued creativity, refinement, and evolution.' },
    ],
    lineage: [
      { label: 'Previously', value: 'BFA, The Cooper Union for the Advancement of Science and Art.' },
      { label: 'Free game', value: 'After Virgil Abloh — the method is open-source; take it, pass it on.' },
    ],
    email: 'hi@blueredandpurple.world',
    phone: '(404) 422-5517',
    team: ['Alex Wedderburn', 'Meng Xuan Zou'],
  }

  await client.create(home)
  console.log('Home document created with content matching the live site.')
  console.log('Edit in Sanity Studio: http://localhost:3333')
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
