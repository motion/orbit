import React, { memo } from 'react'

import { Dock } from './Dock'
import { OrbitDockShare } from './OrbitDockShare'
import { OrbitDockSearch } from './OrbitDockSearch'

export const OrbitDock = memo(() => {
  return (
    <Dock className="orbit-dock">
      <OrbitDockSearch />
      <OrbitDockShare />
    </Dock>
  )
})

// {/* <DockButton icon="cog" index={0} onClick={orbitStore.toggleShowAppSettings} /> */}
