import { defineType, defineField } from 'sanity'

export const heroType = defineType({
  name: 'hero',
  type: 'object',
  title: 'Hero',
  fields: [
    defineField({
      name: 'tagline',
      type: 'string',
      title: 'Tagline',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'layout',
      type: 'string',
      title: 'Layout',
      options: {
        list: [
          { title: 'Centered', value: 'centered' },
          { title: 'Left aligned', value: 'left' },
          { title: 'Split', value: 'split' },
        ],
        layout: 'radio',
      },
      initialValue: 'centered',
    }),
  ],
  preview: {
    select: { title: 'tagline', layout: 'layout' },
    prepare({ title, layout }) {
      return {
        title: title || 'Untitled Hero',
        subtitle: `Hero · ${layout || 'centered'}`,
      }
    },
  },
})
