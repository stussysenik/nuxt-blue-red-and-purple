import { defineType, defineField } from 'sanity'

export const homeType = defineType({
  name: 'home',
  type: 'document',
  title: 'Home Page',
  fields: [
    defineField({
      name: 'tagline',
      type: 'string',
      title: 'Tagline',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'aboutDescription',
      type: 'text',
      title: 'About Description',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'formula',
      type: 'array',
      title: 'Formula Steps',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'step', type: 'string', title: 'Step (e.g. –1 → 0)' }),
            defineField({ name: 'description', type: 'string', title: 'Description' }),
          ],
          preview: {
            select: { step: 'step', description: 'description' },
            prepare({ step, description }) {
              return { title: step || 'Step', subtitle: description }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'lineage',
      type: 'array',
      title: 'Lineage',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label' }),
            defineField({ name: 'value', type: 'string', title: 'Value' }),
          ],
          preview: {
            select: { label: 'label', value: 'value' },
            prepare({ label, value }) {
              return { title: label || 'Entry', subtitle: value }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      type: 'string',
      title: 'Phone',
    }),
    defineField({
      name: 'team',
      type: 'array',
      title: 'Team Members',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page', subtitle: 'blue red + purple' }
    },
  },
})
