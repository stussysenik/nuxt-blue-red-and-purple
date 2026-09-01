import { defineType, defineField } from 'sanity'

export const textSectionType = defineType({
  name: 'textSection',
  type: 'object',
  title: 'Text Section',
  fields: [
    defineField({
      name: 'text',
      type: 'text',
      title: 'Text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'align',
      type: 'string',
      title: 'Alignment',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
  ],
  preview: {
    select: { text: 'text' },
    prepare({ text }) {
      return {
        title: text ? text.slice(0, 60) + (text.length > 60 ? '…' : '') : 'Empty text',
        subtitle: 'Text Section',
      }
    },
  },
})
