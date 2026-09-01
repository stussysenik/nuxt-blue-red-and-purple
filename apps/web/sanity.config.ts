import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { resolve } from './presentation/resolve'
import { pageType } from './schemas/page'
import { workType } from './schemas/work'
import { heroType } from './schemas/blocks/hero'
import { textSectionType } from './schemas/blocks/textSection'
import { worksGridType } from './schemas/blocks/worksGrid'
import { contactType } from './schemas/blocks/contact'

const schemas = [pageType, workType, heroType, textSectionType, worksGridType, contactType]

export default defineConfig({
  name: 'default',
  title: 'blue red + purple',
  projectId: process.env.NUXT_SANITY_PROJECT_ID!,
  dataset: process.env.NUXT_SANITY_DATASET || 'production',
  plugins: [
    structureTool(),
    presentationTool({
      resolve,
      previewUrl: {
        origin: process.env.NUXT_SANITY_STUDIO_URL || 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    visionTool(),
  ],
  schema: {
    types: schemas,
  },
})
