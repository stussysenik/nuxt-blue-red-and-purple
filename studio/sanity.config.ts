import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { resolve } from './presentation/resolve'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'blue red + purple',
  projectId: 'lkyz5ssa',
  dataset: 'production',
  plugins: [
    structureTool(),
    presentationTool({
      resolve,
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_ORIGIN || 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
