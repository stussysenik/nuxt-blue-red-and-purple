import { defineType, defineField } from 'sanity'

export const workType = defineType({
  name: 'work',
  type: 'document',
  title: 'Work',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          { title: 'Restaurant', value: 'restaurant' },
          { title: 'Hotel', value: 'hotel' },
          { title: 'Music', value: 'music' },
          { title: 'Books', value: 'books' },
          { title: 'Vintage', value: 'vintage' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'music',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      type: 'number',
      title: 'Year',
      initialValue: 2024,
      validation: (Rule) => Rule.min(2000).max(2030),
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'summary',
      type: 'text',
      title: 'Summary',
      rows: 3,
    }),
    defineField({
      name: 'mechanic',
      type: 'string',
      title: 'Mechanic',
    }),
    defineField({
      name: 'palette',
      type: 'array',
      title: 'Palette',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'source',
      type: 'string',
      title: 'Source (attribution)',
    }),
    defineField({
      name: 'isReal',
      type: 'boolean',
      title: 'Real project',
      initialValue: false,
    }),
    defineField({
      name: 'isHidden',
      type: 'boolean',
      title: 'Hidden',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      type: 'number',
      title: 'Sort order',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'title', category: 'category', year: 'year', media: 'image' },
    prepare({ title, category, year, media }) {
      return {
        title: title || 'Untitled',
        subtitle: `${category || '—'} · ${year || '—'}`,
        media,
      }
    },
  },
  orderings: [
    { title: 'Sort order', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] },
    { title: 'Year (newest)', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
    { title: 'Title A-Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
})
