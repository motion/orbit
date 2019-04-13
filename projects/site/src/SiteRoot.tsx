import { ProvideUI } from '@o/ui'
import { mount, route } from 'navi'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Router } from 'react-navi'
import { Body } from './Body'
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
})

export const SiteRoot = hot(() => {
  return (
    <ProvideUI themes={themes}>
      <MDX>
        <Body>
          <Router routes={routes} />
        </Body>
      </MDX>
    </ProvideUI>
  )
})
