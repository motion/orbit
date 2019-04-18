import { ProvideUI } from '@o/ui'
import { createBrowserNavigation, lazy, mount, route } from 'navi'
import React, { Suspense } from 'react'
import { hot } from 'react-hot-loader/root'
import { Router, View } from 'react-navi'
import { Layout } from './Layout'
import { HomePage } from './pages/HomePage'
import { themes } from './themes'

// Define your routes
const routes = mount({
  '/': route({
    title: 'Orbit',
    view: <HomePage />,
  }),
  '/docs': lazy(() => import('./pages/DocsPage')),
  '/blog': lazy(() => import('./pages/BlogPage')),
  '/about': route({
    title: 'About',
    view: lazy(() => import('./pages/AboutPage')),
  }),
  '/beta': route({
    title: 'Beta',
    view: lazy(() => import('./pages/BetaPage')),
  }),
  '/apps': route({
    title: 'Apps',
    view: lazy(() => import('./pages/AppsPage')),
  }),
})

export const Navigation = createBrowserNavigation({
  routes,
})

export async function getPageForPath() {
  const res = await Navigation.getRoute()
  return res.views[0].type || res.views[0]
}

export const SiteRoot = hot(() => {
  return (
    <Router navigation={Navigation}>
      <ProvideUI themes={themes}>
        <Layout>
          <Suspense fallback={null}>
            <View />
          </Suspense>
        </Layout>
      </ProvideUI>
    </Router>
  )
})
