import { createBrowserNavigation, lazy, mount, route } from 'navi'
import React from 'react'

import { HomePage } from './pages/HomePage'

// for easy pre-loading
export const routeTable = {
  '/docs': () => import('./pages/DocsPage'),
  '/blog': () => import('./pages/BlogPage'),
  '/about': () => import('./pages/AboutPage'),
  '/beta': () => import('./pages/BetaPage'),
  '/apps': () => import('./pages/AppsPage'),
  '/privacy': () => import('./pages/PrivacyPage'),
  '/terms': () => import('./pages/TermsPage'),
  '/faq': () => import('./pages/FAQPage'),
}

// window for hmr preservation

export const Navigation = createBrowserNavigation({
  routes: mount({
    '/': route({
      title: 'Orbit',
      view: <HomePage />,
    }),
    // wrap routes in lazy
    ...Object.keys(routeTable).reduce((acc, key) => {
      acc[key] = lazy(routeTable[key])
      return acc
    }, {}),
  }),
})

// google analytics

const gtag = window['gtag']
const gevent = obj => {
  console.debug('analytics', window['gid'], obj)
  gtag('config', window['gid'], obj)
}

Navigation.subscribe(next => {
  if (next.type === 'ready') {
    gevent({
      page_title: next.title,
      page_path: next.url.pathname,
    })
  }
})

// WARNING we had crazy circular dependencies, quick fix is here... see LinkState
window['Navigation'] = Navigation
window['routeTable'] = routeTable
