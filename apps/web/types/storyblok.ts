// Storyblok block type definitions
export interface SbComponentType {
  _uid: string
  component: string
}

export interface SbStoryType {
  name: string
  created_at: string
  published_at: string | null
  updated_at: string
  id: number
  uuid: string
  content: {
    _uid: string
    component: string
    body?: SbComponentType[]
    [key: string]: unknown
  }
  slug: string
  full_slug: string
  version: string
}

// Storyblok component prop types — one interface per block
// Add new block types here as you create components

export interface HeroBlock {
  _uid: string
  component: 'hero'
  tagline?: string
}

export interface AboutBlock {
  _uid: string
  component: 'about'
  description?: string
  formula?: Array<{ _uid: string; step: string; description: string }>
  lineage?: Array<{ _uid: string; label: string; value: string }>
}

export interface ContactsBlock {
  _uid: string
  component: 'contacts'
  email?: string
  phone?: string
  team?: string[]
}

export interface GridBlock {
  _uid: string
  component: 'grid'
  columns?: Array<SbComponentType>
}

export interface FeatureBlock {
  _uid: string
  component: 'feature'
  name?: string
}

export interface TeaserBlock {
  _uid: string
  component: 'teaser'
  headline?: string
}

export interface PageBlock {
  _uid: string
  component: 'page'
  body?: Array<SbComponentType>
  seo?: {
    meta_title?: string
    meta_description?: string
    og_image?: { filename: string }
  }
}

// Union type for all known blocks
export type StoryblokBlock =
  | HeroBlock
  | AboutBlock
  | ContactsBlock
  | GridBlock
  | FeatureBlock
  | TeaserBlock
  | PageBlock
