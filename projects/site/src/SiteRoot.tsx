import { ProvideUI } from '@o/ui'
import { mount, route } from 'navi'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { Router } from 'react-navi'
import { DocsPage } from './pages/DocsPage'
import { HomePage } from './pages/HomePage'
import { ProvideSiteStore } from './SiteStore'
import { themes } from './themes'
import { MDX } from './views/MDX'

// Define your routes
const routes = mount({
  '/': route({
    title: 'My Shop',
    view: <HomePage />,
  }),
  // '/products': lazy(() => import('./productsRoutes')),
  '/docs': route({
    title: 'Docs',
    view: DocsPage,
  }),
})

export const SiteRoot = hot(() => {
  return (
    <ProvideUI themes={themes} activeTheme="light">
      <MDX>
        <ProvideSiteStore>
          <Router routes={routes} />
        </ProvideSiteStore>
      </MDX>
    </ProvideUI>
  )
})
