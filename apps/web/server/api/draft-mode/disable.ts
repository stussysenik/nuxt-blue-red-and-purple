import { defineEventHandler, sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
  // Clear draft mode cookie
  deleteCookie(event, 'sanity-preview', { path: '/' })
  return sendRedirect(event, '/')
})
