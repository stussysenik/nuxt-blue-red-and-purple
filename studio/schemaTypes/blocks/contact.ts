import { defineType, defineField } from 'sanity'

export const contactType = defineType({
  name: 'contact',
  type: 'object',
  title: 'Contact',
  fields: [
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
  ],
  preview: {
    select: { email: 'email' },
    prepare({ email }) {
      return {
        title: email || 'No email set',
        subtitle: 'Contact',
      }
    },
  },
})
