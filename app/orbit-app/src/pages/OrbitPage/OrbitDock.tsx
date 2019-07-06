import { Badge, Dock, DockButton, DockButtonPassProps, Menu, useNodeSize } from '@o/ui'
import React, { memo, useRef, useState } from 'react'

import { useOrbitStore } from '../../om/stores'
import { OrbitDockSearch } from './OrbitDockSearch'
import { OrbitDockShare, useIsOnStaticApp } from './OrbitDockShare'

export const OrbitDock = memo(() => {
  const isOnStaticApp = useIsOnStaticApp()
  const dockRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(true)
  const size = useNodeSize({
    ref: dockRef,
    throttle: 200,
  })

  return (
    <DockButtonPassProps sizePadding={2.2}>
      <Dock
        ref={dockRef}
        onMouseEnter={() => {
          setOpen(true)
        }}
        onMouseLeave={() => {
          setOpen(false)
        }}
        transform={
          open
            ? {
                x: 30,
              }
            : {
                x: size.width - 10,
              }
        }
        transition="all ease 300ms"
        className="orbit-dock"
        group
      >
        {!isOnStaticApp && <OrbitDockMenu />}
        <OrbitDockShare />
        <OrbitDockSearch />
      </Dock>
    </DockButtonPassProps>
  )
})

const useActiveAppMenuItems = () => {
  const orbitStore = useOrbitStore()
  if (!orbitStore.activeAppStore) {
    return []
  }
  return orbitStore.activeAppStore.menuItems || []
}

const OrbitDockMenu = memo(() => {
  const menuItems = useActiveAppMenuItems()
  return (
    <Menu
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
})

// {/* <DockButton icon="cog" index={0} onClick={orbitStore.toggleShowAppSettings} /> */}
