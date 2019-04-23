import { createBrowserNavigation, lazy, mount, route } from 'navi'
import React from 'react'

import { HomePage } from './pages/HomePage'

// Define your routes
const routes = mount({
  '/': route({
    title: 'Orbit',
    view: <HomePage />,
  }),
  '/docs': lazy(() => import('./pages/DocsPage')),
  '/blog': lazy(() => import('./pages/BlogPage')),
  '/about': lazy(() => import('./pages/AboutPage')),
  '/beta': lazy(() => import('./pages/BetaPage')),
  '/apps': lazy(() => import('./pages/AppsPage')),
})

// window for hmr preservation

export const Navigation = createBrowserNavigation({
  routes,
})

window['Navigation'] = Navigation
