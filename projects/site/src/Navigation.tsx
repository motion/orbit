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
}

// window for hmr preservation

export const Navigation = createBrowserNavigation({
  routes: mount({
    '/': route({
      title: 'Orbit',
      view: <HomePage />,
    }),
    '/docs': lazy(routeTable['/docs']),
    '/blog': lazy(routeTable['/blog']),
    '/about': lazy(routeTable['/about']),
    '/beta': lazy(routeTable['/beta']),
    '/apps': lazy(routeTable['/apps']),
  }),
})

window['Navigation'] = Navigation
