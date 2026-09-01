import { defineEventHandler, getQuery, sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
  const { redirect: redirectPath } = getQuery(event)
  // Set draft mode cookie
  setCookie(event, 'sanity-preview', 'true', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
  return sendRedirect(event, (redirectPath as string) || '/')
})
