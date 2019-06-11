import { Badge, Dock, DockButton, PopoverMenu } from '@o/ui'
import React, { memo } from 'react'

import { useStores } from '../../hooks/useStores'
import { OrbitDockSearch } from './OrbitDockSearch'
import { OrbitDockShare, useIsOnStaticApp } from './OrbitDockShare'

export const OrbitDock = memo(() => {
  const isOnStaticApp = useIsOnStaticApp()

  return (
    <Dock transition="all ease 300ms" className="orbit-dock">
      <OrbitDockShare />
      <OrbitDockSearch />
      {!isOnStaticApp && <OrbitDockMenu />}
    </Dock>
  )
})

const useActiveAppMenuItems = () => {
  const { orbitStore } = useStores()
  if (!orbitStore.activeAppStore) {
    return []
  }
  return orbitStore.activeAppStore.menuItems || []
}

const OrbitDockMenu = () => {
  const menuItems = useActiveAppMenuItems()
  return (
    <PopoverMenu
      target={<DockButton id="app-menu" icon="menu" />}
      items={[
        {
          title: 'Errors',
          before: <Badge>2</Badge>,
        },
        ...menuItems.map(item => ({
          title: item.title,
          subTitle: item.subTitle,
          icon: item.icon,
        })),
      ]}
    />
  )
}

// {/* <DockButton icon="cog" index={0} onClick={orbitStore.toggleShowAppSettings} /> */}
