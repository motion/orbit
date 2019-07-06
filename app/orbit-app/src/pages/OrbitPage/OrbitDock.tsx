import { AppBit, createUsableStore, getAppDefinition, react } from '@o/kit'
import { Badge, Dock, DockButton, DockButtonPassProps, FloatingCard, Menu, useNodeSize, usePosition, useThrottledFn } from '@o/ui'
import React, { memo, useRef, useState } from 'react'

import { om, useOm } from '../../om/om'
import { useOrbitStore } from '../../om/stores'
import { OrbitApp } from './OrbitApp'

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
  const { state } = useOm()
  const activeDockApps = state.apps.activeDockApps
  const store = orbitDockStore.useStore()
  const dockRef = useRef<HTMLElement>(null)
  const size = useNodeSize({
    ref: dockRef,
    throttle: 200,
  })

  return (
    <DockButtonPassProps>
      <Dock
        flexDirection="column"
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
        {activeDockApps.map(app => (
          <OrbitDockButton key={app.id} app={app} />
        ))}
        {/*
        <OrbitDockButton
          id="apps"
          onClick={() => {
            om.actions.router.showAppPage({ id: 'apps', toggle: 'docked' })
          }}
          icon="layout-grid"
          label="Manage apps"
        />
        <OrbitDockButton
          id="settings"
          onClick={() => {
            om.actions.router.showAppPage({ id: 'settings', toggle: 'docked' })
          }}
          icon="cog"
          label="Settings"
        /> */}
      </Dock>
    </DockButtonPassProps>
  )
})

const OrbitDockButton = ({ app }: { app: AppBit }) => {
  const definition = getAppDefinition(app.identifier!)
  console.log('apo', app, definition)
  const buttonRef = useRef(null)
  const nodePosition = usePosition({ ref: buttonRef, debounce: 500 })
  const [hovered, setHoveredRaw] = useState(false)
  const setHovered = useThrottledFn(setHoveredRaw, { amount: 200 })
  const [hoveredMenu, setHoveredMenu] = useState(false)
  const showMenu = hovered || hoveredMenu

  const width = 350
  const height = 400

  return (
    <>
      <DockButton
        id={`${app.id}`}
        onClick={() => {
          om.actions.router.showAppPage({ id: app.id, toggle: 'docked' })
        }}
        icon={definition.icon || 'layers'}
        label={app.name}
        forwardRef={buttonRef}
        labelProps={{
          transition: 'all ease 300ms',
          ...(hovered && {
            opacity: 1,
            transform: {
              y: 0,
            },
          }),
          ...(!hovered && { opacity: 0, transform: { y: -10 } }),
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {nodePosition && nodePosition.rect && (
        <FloatingCard
          defaultWidth={width}
          defaultHeight={height}
          defaultTop={nodePosition.rect.top - height + 20}
          defaultLeft={nodePosition.rect.left - width + 20}
          padding={0}
          zIndex={10000000}
          visible={showMenu}
          onMouseEnter={() => setHoveredMenu(true)}
          onMouseLeave={() => setHoveredMenu(false)}
        >
          <OrbitApp id={app.id!} identifier={app.identifier!} appDef={definition} renderApp />
        </FloatingCard>
      )}
    </>
  )
}

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
