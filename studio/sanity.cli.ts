import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'lkyz5ssa',
    dataset: 'production',
  },
  // TypeGen: generates TypeScript types from schema + queries
  typegen: {
    enabled: true,
    path: '../apps/web/**/*.{ts,tsx,js,jsx}',
    schema: 'schema.json',
    generates: '../apps/web/sanity.types.ts',
    overloadClientMethods: true,
  },
})
