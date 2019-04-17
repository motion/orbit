import { ProvideUI } from '@o/ui'
import { createBrowserNavigation, mount, route } from 'navi'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Router } from 'react-navi'
import { Layout } from './Layout'
import { AboutPage } from './pages/AboutPage'
import { BetaPage } from './pages/BetaPage'
import { DocsPage } from './pages/DocsPage'
import { HomePage } from './pages/HomePage'
import { themes } from './themes'
import { MDX } from './views/MDX'

// Define your routes
const routes = mount({
  '/': route({
    title: 'Orbit',
    view: <HomePage />,
  }),
  // '/products': lazy(() => import('./productsRoutes')),
  '/docs': route({
    title: 'Docs',
    view: DocsPage,
  }),
  '/about': route({
    title: 'About',
    view: AboutPage,
  }),
  '/beta': route({
    title: 'Beta',
    view: BetaPage,
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
    <ProvideUI themes={themes}>
      <MDX>
        <Layout>
          <Router navigation={Navigation} />
        </Layout>
      </MDX>
    </ProvideUI>
  )
})
