import { defineType, defineField } from 'sanity'

export const worksGridType = defineType({
  name: 'worksGrid',
  type: 'object',
  title: 'Works Grid',
  fields: [
    defineField({
      name: 'columns',
      type: 'number',
      title: 'Columns',
      initialValue: 3,
      validation: (Rule) => Rule.min(1).max(6),
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          { title: 'All', value: 'all' },
          { title: 'Restaurant', value: 'restaurant' },
          { title: 'Hotel', value: 'hotel' },
          { title: 'Music', value: 'music' },
          { title: 'Books', value: 'books' },
          { title: 'Vintage', value: 'vintage' },
        ],
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'showCount',
      type: 'number',
      title: 'Show Count',
      initialValue: 6,
      validation: (Rule) => Rule.min(1).max(24),
    }),
  ],
  preview: {
    select: { columns: 'columns', category: 'category' },
    prepare({ columns, category }) {
      return {
        title: `${columns || 3} columns · ${category || 'all'}`,
        subtitle: 'Works Grid',
      }
    },
  },
})
