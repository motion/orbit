import { createBrowserNavigation, mount, route } from 'navi'
import React from 'react'

import { OrbitPage } from './pages/OrbitPage/OrbitPage'

// window for hmr preservation

export const Navigation = createBrowserNavigation({
  routes: mount({
    '/': route({
      title: 'Orbit',
      view: <OrbitPage />,
    }),
  }),
})
