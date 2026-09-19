import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Canonical + absolute Open Graph/Twitter image tags. Override with SITE_URL if the domain changes.
const SITE = process.env.SITE_URL || 'https://tarecocomissao.netlify.app/'
const siteUrl = SITE.replace(/\/?$/, '/')
const seo = () => ({
  name: 'seo-tags',
  transformIndexHtml: () => ([
    { tag: 'link', attrs: { rel: 'canonical', href: siteUrl }, injectTo: 'head' },
    { tag: 'meta', attrs: { property: 'og:url', content: siteUrl }, injectTo: 'head' },
    { tag: 'meta', attrs: { property: 'og:image', content: `${siteUrl}og.jpg` }, injectTo: 'head' },
    { tag: 'meta', attrs: { name: 'twitter:image', content: `${siteUrl}og.jpg` }, injectTo: 'head' },
  ]),
})

// base './' lets the built site work from any sub-path (GitHub Pages, etc.)
export default defineConfig({ base: './', plugins: [react(), seo()] })
