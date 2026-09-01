// Content abstraction layer — swap Sanity for a self-hosted backend later
// by implementing this interface in a new adapter file.

export interface ContentAdapter {
  getPage(slug: string): Promise<PageContent | null>
  getWorks(filter?: { category?: string }): Promise<WorkContent[]>
  getWorkBySlug(slug: string): Promise<WorkContent | null>
}

export interface PageContent {
  title: string
  slug: string
  sections: Section[]
}

export type Section =
  | { _type: 'hero'; _key: string; tagline: string; layout: string }
  | { _type: 'textSection'; _key: string; text: string; align: string }
  | { _type: 'worksGrid'; _key: string; columns: number; category: string; showCount: number }
  | { _type: 'contact'; _key: string; email: string; phone: string }

export interface WorkContent {
  id: string
  slug: string
  title: string
  category: string
  year: number
  image?: { asset: { _ref: string } }
  palette?: string[]
  mechanic?: string
  summary?: string
  isReal?: boolean
  isHidden?: boolean
}

// Current adapter: Sanity
// Future adapters: SelfHostedAdapter, StaticAdapter, etc.
