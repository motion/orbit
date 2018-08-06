import * as React from 'react'
import { OrbitDocked } from './orbitDocked/OrbitDocked'
import { OrbitRootShortcuts } from './OrbitRootShortcuts'
// import OrbitContext from './orbit/orbitContext'

export const Orbit = () => (
  <OrbitRootShortcuts>
    <OrbitDocked />
    {/* <OrbitContext /> */}
  </OrbitRootShortcuts>
)
