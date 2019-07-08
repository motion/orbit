import { AppBit, createUsableStore, getAppDefinition, react, useReaction } from '@o/kit'
import { Dock, DockButton, DockButtonPassProps, FloatingCard, useDebounceValue, useNodeSize, usePosition, useWindowSize } from '@o/ui'
import React, { memo, useRef, useState } from 'react'

import { om, useOm } from '../../om/om'
import { paneManagerStore } from '../../om/stores'
import { OrbitApp } from './OrbitApp'

type DockOpenState = 'open' | 'closed' | 'pinned'

class OrbitDockStore {
  state: DockOpenState = 'pinned'
  nextState: { state: DockOpenState; delay: number } | null = null
  hoveredIndex = -1
  nextHovered: { index: number; at: number } | null = null

  get isOpen() {
    return this.state !== 'closed'
  }

  setState(next: DockOpenState = 'open') {
    if (next === this.state) return
    this.state = next
    this.nextState = null
  }

  deferUpdateState = react(
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
    this.setState('closed')
    this.nextHovered = null
    // hide hover immediately on force close
    this.hoveredIndex = -1
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

  hoverEnterButton = (index: number) => {
    if (this.nextHovered && this.nextHovered.index === index) return
    this.nextHovered = { index, at: Date.now() }
  }

  hoverLeaveButton = () => {
    if (this.nextHovered && this.nextHovered.index === -1) return
    this.nextHovered = { index: -1, at: Date.now() }
  }

  deferUpdateHoveringButton = react(
    () => this.nextHovered,
    async (next, { sleep }) => {
      if (!next) return
      if (this.hoveredIndex === -1 || next.index === -1) {
        await sleep(next.index > -1 ? 200 : 500)
      }
      this.hoveredIndex = next.index
      await sleep(100)
      if (next.index > -1) {
        this.hoverEnter()
      } else {
        this.hoverLeave()
      }
    },
    {
      lazy: true,
    },
  )

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

  console.log('ok', store.isOpen, store.nextHovered, store.nextState)

  return (
    <DockButtonPassProps>
      <Dock
        flexDirection="column"
        ref={dockRef}
        pointerEvents={store.state === 'closed' ? 'none' : 'inherit'}
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
        space={18}
        bottom="auto"
        top={80}
      >
        {/* <OrbitDockShare />
        <OrbitDockSearch /> */}
        {activeDockApps.map((app, index) => (
          <OrbitDockButton key={app.id} app={app} index={index} />
        ))}
      </Dock>
    </DockButtonPassProps>
  )
})

const OrbitDockButton = memo(({ index, app }: { app: AppBit; index: number }) => {
  const dockStore = orbitDockStore.useStore()
  const definition = getAppDefinition(app.identifier!)
  const buttonRef = useRef(null)
  const fullyOpened = useDebounceValue(dockStore.isOpen, 300)
  const nodePosition = usePosition({
    measureKey: fullyOpened,
    ref: buttonRef,
    debounce: 500,
  })
  const [hoveredMenu, setHoveredMenu] = useState(false)
  const showMenu = dockStore.hoveredIndex === index || hoveredMenu
  const showTooltip = dockStore.hoveredIndex === -1 && !showMenu
  const isActive = useReaction(() => paneManagerStore.activePane && paneManagerStore.activePane.id === `${app.id}`)

  console.log('nodePosition', nodePosition)

  return (
    <>
      <DockButton
        id={`${app.id}`}
        active={isActive}
        onClick={() => {
          om.actions.router.showAppPage({ id: `${app.id!}`, toggle: 'docked' })
          dockStore.close()
        }}
        icon={definition.icon || 'layers'}
        label={app.name}
        forwardRef={buttonRef}
        labelProps={{
          transition: 'all ease 300ms',
          ...(showTooltip && {
            transition: 'all ease 300ms 300ms',
            opacity: 1,
            transform: {
              y: 0,
            },
          }),
          ...(!showTooltip && { opacity: 0, transform: { y: -10 } }),
        }}
        onMouseMove={() => {
          // wait for settle
          if (dockStore.hoveredIndex === -1) {
            dockStore.hoverEnterButton(index)
          }
        }}
        onMouseEnter={() => {
          dockStore.hoverEnterButton(index)
        }}
        onMouseLeave={() => {
          dockStore.hoverLeaveButton()
        }}
      />
      {nodePosition && nodePosition.rect && (
        <FloatingAppWindow
          setHoveredMenu={setHoveredMenu}
          buttonRect={nodePosition.rect}
          showMenu={showMenu}
          definition={definition}
          app={app}
        />
      )}
    </>
  )
})

const FloatingAppWindow = ({ showMenu, buttonRect, setHoveredMenu, app, definition }) => {
  const width = 300
  const height = 380
  const [, windowHeight] = useWindowSize({ throttle: 100 })
  let top = buttonRect.top - 40
  const left = buttonRect.left - width - 20

  if (height + top > windowHeight) {
    top -= height + top - windowHeight - 20
  }

  return (
    <FloatingCard
      defaultWidth={width}
      defaultHeight={height}
      defaultTop={top}
      defaultLeft={left}
      padding={0}
      zIndex={10000000}
      visible={showMenu}
      onMouseEnter={() => setHoveredMenu(true)}
      onMouseLeave={() => setHoveredMenu(false)}
    >
      <OrbitApp id={app.id!} identifier={app.identifier!} appDef={definition} renderApp />
    </FloatingCard>
  )
}

// this could work to let apps ahve their own dock items...
// const useActiveAppMenuItems = () => {
//   const orbitStore = useOrbitStore()
//   if (!orbitStore.activeAppStore) {
//     return []
//   }
//   return orbitStore.activeAppStore.menuItems || []
// }
