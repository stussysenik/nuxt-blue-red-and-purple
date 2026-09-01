// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-08-27',
  devtools: { enabled: true },
  devServer: {
    host: '127.0.0.1',
    port: 3000,
  },
  nitro: {
    preset: 'vercel',
    prerender: {
      crawl: true,
      routes: [
        '/showcase',
        '/generator',
        '/design',
        '/world',
      ],
      ignore: ['/api/**', '/admin'],
    },
  },
  routeRules: {
    // Storyblok-powered pages: SSR with s-maxage cache
    '/': { swr: 60, ssr: true },
    '/works': { swr: 60, ssr: true },
    '/works/**': { swr: 300, ssr: true },
    // Static pages: prerender at build time
    '/showcase': { prerender: true },
    '/generator': { prerender: true },
    '/design': { prerender: true },
    '/world': { prerender: true },
    // API routes
    '/api/**': { ssr: true },
  },
  modules: ['@unocss/nuxt', '@storyblok/nuxt'],

  storyblok: {
    accessToken: 'zpujJltrUcgk20CfGqTe5gtt',
    // bridge: enables the visual editor bridge for inline editing
    // Editors see "Edit" overlays when logged into Storyblok preview
    bridge: true,
    enableSudo: true,
    // Visual editor: enables live preview and inline editing
    apiOptions: {
      cache: { type: 'memory', clear: 'auto' },
    },
  },
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
