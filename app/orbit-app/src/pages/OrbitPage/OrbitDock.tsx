import React, { memo } from 'react'

import { Dock } from './Dock'
import { OrbitFloatingShareCard } from './OrbitFloatingShareCard'
import { OrbitSearchModal } from './OrbitSearchModal'

export const OrbitDock = memo(() => {
  return (
    <Dock className="orbit-dock">
      <OrbitSearchModal />
      <OrbitFloatingShareCard />
    </Dock>
  )
})

// {/* <DockButton icon="cog" index={0} onClick={orbitStore.toggleShowAppSettings} /> */}
