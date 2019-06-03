import { Dock, DockButton, PopoverMenu } from '@o/ui'
import React, { memo } from 'react'

import { useStores } from '../../hooks/useStores'
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
      <OrbitDockAppMenu />
    </Dock>
  )
})

const OrbitDockAppMenu = () => {
  const { orbitStore } = useStores()
  if (!orbitStore.activeAppStore) {
    return null
  }
  const { menuItems } = orbitStore.activeAppStore
  if (!menuItems || !menuItems.length) {
    return null
  }
  console.log('menuItems', menuItems, orbitStore.activeAppStore)
  return (
    <PopoverMenu
      target={<DockButton id="app-menu" icon="menu" />}
      items={menuItems.map(item => ({
        title: item.title,
        subTitle: item.subTitle,
        icon: item.icon,
      }))}
    />
  )
}

// {/* <DockButton icon="cog" index={0} onClick={orbitStore.toggleShowAppSettings} /> */}
