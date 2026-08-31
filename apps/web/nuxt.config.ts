// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-08-27',
  devtools: { enabled: false },
  devServer: {
    host: '127.0.0.1',
    port: 3000,
  },
  nitro: {
    preset: 'vercel',
    prerender: {
      crawl: true,
      routes: [
        '/',
        '/works',
        '/works/smac',
        '/works/olive-thyme',
        '/works/midnight-noodle',
        '/works/veranda',
        '/works/after',
        '/works/b374',
        '/works/d429',
        '/works/f853',
        '/works/skrillex',
        '/works/b421',
        '/works/b508',
        '/works/b970',
        '/works/echo-chamber',
        '/works/g858',
        '/works/h724',
        '/works/l384',
        '/works/p673',
        '/works/d445',
        '/showcase',
        '/generator',
        '/design',
        '/world',
      ],
      ignore: ['/api/**', '/admin'],
    },
  },
  routeRules: {
    '/': { prerender: true },
    '/works': { prerender: true },
    '/works/**': { prerender: true },
    '/showcase': { prerender: true },
    '/generator': { prerender: true },
    '/design': { prerender: true },
    '/world': { prerender: true },
    '/api/**': { ssr: true },
  },
  modules: ['@unocss/nuxt'],
  css: ['~/assets/css/fonts.css', '~/assets/css/base.css'],
  router: {},
  app: {
    head: {
      title: '*blue red + purple/',
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        {
          name: 'description',
          content:
            'A design agency with one specialization: one-page systems. One fixed content structure, four interchangeable design systems — switched live.',
        },
        { name: 'theme-color', content: '#F7F3EC', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#16130F', media: '(prefers-color-scheme: dark)' },
        { property: 'og:title', content: 'blue red + purple' },
        {
          property: 'og:description',
          content:
            'A design agency with one specialization: one-page systems. One fixed content structure, four interchangeable design systems — switched live.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://blueredandpurple.world/' },
        { property: 'og:image', content: 'https://blueredandpurple.world/og.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'preload',
          href: '/fonts/archivo-wght.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
        {
          rel: 'preload',
          href: '/fonts/ibm-plex-mono-400.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
      ],
      script: [
        {
          innerHTML: `(()=>{const r=document.documentElement;const s=localStorage.getItem('theme');const d=s==='dark'||(!s&&matchMedia('(prefers-color-scheme: dark)').matches);r.dataset.theme=d?'dark':'light';r.dataset.mode='generative';})()`,
        },
      ],
    },
  },
});
