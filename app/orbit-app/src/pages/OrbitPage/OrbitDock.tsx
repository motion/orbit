import { Dock } from '@o/ui'
import React, { memo } from 'react'

import { OrbitDockSearch } from './OrbitDockSearch'
import { OrbitDockShare } from './OrbitDockShare'

export const OrbitDock = memo(() => {
  return (
    <Dock className="orbit-dock">
      <OrbitDockShare />
      <OrbitDockSearch />
    </Dock>
  )
})

// {/* <DockButton icon="cog" index={0} onClick={orbitStore.toggleShowAppSettings} /> */}
