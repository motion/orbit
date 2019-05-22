import { Dock } from '@o/ui'
import React, { memo } from 'react'

import { OrbitDockSearch } from './OrbitDockSearch'
import { OrbitDockShare, useIsOnStaticApp } from './OrbitDockShare'

export const OrbitDock = memo(() => {
  const isOnStaticApp = useIsOnStaticApp()
  return (
    <Dock
      transition="all ease 300ms"
      transform={{ y: isOnStaticApp ? 100 : 0 }}
      className="orbit-dock"
    >
      <OrbitDockShare />
      <OrbitDockSearch />
    </Dock>
  )
})

// {/* <DockButton icon="cog" index={0} onClick={orbitStore.toggleShowAppSettings} /> */}
