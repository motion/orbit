import { ProvideUI } from '@o/ui'
import { createBrowserNavigation, lazy, mount, route } from 'navi'
import React, { Suspense } from 'react'
import { hot } from 'react-hot-loader/root'
import { Router } from 'react-navi'
import { Layout } from './Layout'
import { AboutPage } from './pages/AboutPage'
import { AppsPage } from './pages/AppsPage'
import { BetaPage } from './pages/BetaPage'
import { HomePage } from './pages/HomePage'
import { themes } from './themes'
import { MDX } from './views/MDX'

// Define your routes
const routes = mount({
  '/': route({
    title: 'Orbit',
    view: <HomePage />,
  }),
  '/docs': lazy(() => import(/* webpackChunkName: "DocsPage" */ './pages/DocsPage')),
  '/about': route({
    title: 'About',
    view: AboutPage,
  }),
  '/beta': route({
    title: 'Beta',
    view: BetaPage,
  }),
  '/apps': route({
    title: 'Apps',
    view: AppsPage,
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
      <Suspense fallback={null}>
        <MDX>
          <Layout>
            <Router navigation={Navigation} />
          </Layout>
        </MDX>
      </Suspense>
    </ProvideUI>
  )
})
