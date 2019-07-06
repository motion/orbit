import { createUsableStore, react } from '@o/kit'
import { Badge, Dock, DockButton, DockButtonPassProps, Menu, useNodeSize } from '@o/ui'
import React, { memo, useRef } from 'react'

import { om } from '../../om/om'
import { useOrbitStore } from '../../om/stores'

type DockOpenState = 'open' | 'closed' | 'pinned'

class OrbitDockStore {
  state: DockOpenState = 'pinned'
  nextState: { state: DockOpenState; delay: number } | null = null

  get isOpen() {
    return this.state !== 'closed'
  }

  setState(next: DockOpenState = 'open') {
    this.state = next
    this.nextState = null
  }

  deferUpdate = react(
    () => this.nextState,
    async (nextState, { sleep }) => {
      if (nextState) {
        await sleep(nextState.delay)
        this.state = nextState.state
        this.nextState = null
      }
    },
  )

  close = () => {
    this.state = 'closed'
  }

  hoverLeave = () => {
    if (this.state !== 'pinned') {
      this.nextState = {
        state: 'closed',
        delay: 500,
      }
    }
  }

  hoverEnter = () => {
    if (this.state !== 'pinned') {
      this.setState('open')
    }
  }

  togglePinned = () => {
    switch (this.state) {
      case 'pinned':
        this.setState('closed')
        return
      case 'closed':
        this.setState('pinned')
        return
      case 'open':
        this.setState('pinned')
        return
    }
  }
}

export const orbitDockStore = createUsableStore(OrbitDockStore)
window['orbitDockStore'] = orbitDockStore

export const OrbitDock = memo(() => {
  const store = orbitDockStore.useStore()
  const dockRef = useRef<HTMLElement>(null)
  const size = useNodeSize({
    ref: dockRef,
    throttle: 200,
  })

  return (
    <DockButtonPassProps>
      <Dock
        direction="column"
        ref={dockRef}
        onMouseEnter={store.hoverEnter}
        onMouseLeave={store.hoverLeave}
        transform={
          store.isOpen
            ? {
                x: 0,
              }
            : {
                x: size.width + 40,
              }
        }
        transition="all ease 300ms"
        className="orbit-dock"
        space="lg"
        bottom="auto"
        top={80}
      >
        {/* <OrbitDockShare />
        <OrbitDockSearch /> */}
        <DockButton
          id="query-builder"
          onClick={() => {
            om.actions.router.showAppPage({ id: 'query-builder', toggle: 'docked' })
          }}
          icon="layers"
          label="Query Builder"
        />
        <DockButton
          id="apps"
          onClick={() => {
            om.actions.router.showAppPage({ id: 'apps', toggle: 'docked' })
          }}
          icon="layout-grid"
          label="Manage apps"
        />
        <DockButton
          id="settings"
          onClick={() => {
            om.actions.router.showAppPage({ id: 'settings', toggle: 'docked' })
          }}
          icon="cog"
          label="Settings"
        />
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
