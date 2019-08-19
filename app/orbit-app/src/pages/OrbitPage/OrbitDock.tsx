import { AppBit, AppLoadContext, AppMainViewProps, AppViewsContext, createUsableStore, getAppDefinition, react, RenderAppProps, useReaction, useStore } from '@o/kit'
import { App } from '@o/stores'
import { ActiveDraggables, Col, Dock, DockButton, DockButtonPassProps, DockButtonProps, FloatingCard, ListPassProps, useDebounceValue, useNodeSize, usePosition, useWindowSize } from '@o/ui'
import { Box, FullScreen, gloss, useTheme } from 'gloss'
import { partition } from 'lodash'
import React, { memo, useContext, useMemo, useRef } from 'react'

import { om, useOm } from '../../om/om'
import { paneManagerStore } from '../../om/stores'
import { OrbitApp } from './OrbitApp'
import { appsDrawerStore } from './OrbitAppsDrawer'

type DockOpenState = 'open' | 'closed' | 'pinned'

class OrbitDockStore {
  state: DockOpenState = 'closed'
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
      this.nextState = {
        state: 'open',
        delay: 0,
      }
    }
  }

  hoverEnterButton = (index: number = this.hoveredIndex) => {
    if (this.nextHovered && this.nextHovered.index === index) return
    this.nextHovered = { index, at: Date.now() }
  }

  hoverLeaveButton = () => {
    if (this.nextHovered && this.nextHovered.index === -1) return
    this.nextHovered = { index: -1, at: Date.now() }
  }

  addCancelableDragOnMenuOpen = react(
    () => this.hoveredIndex,
    index => {
      if (index > -1) {
        ActiveDraggables.add(this.hoverEnterButton)
      } else {
        ActiveDraggables.remove(this.hoverEnterButton)
      }
    },
  )

  deferUpdateHoveringButton = react(
    () => this.nextHovered,
    async (next, { sleep }) => {
      if (!next) return
      if (this.hoveredIndex === -1 || next.index === -1) {
        await sleep(next.index > -1 ? 100 : 200)
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

export const OrbitDock = memo(() => {
  const store = orbitDockStore.useStore()
  const { state } = useOm()
  const { appRole } = useStore(App)
  const isTorn = appRole === 'torn'
  const activeDockApps = state.apps.activeDockApps.filter(x =>
    isTorn ? x.identifier !== 'apps' : true,
  )
  const [bottomDockApps, topDockApps] = partition(
    activeDockApps,
    _ => _.identifier === 'settings' || _.identifier === 'apps',
  )

  return (
    <Col
      position="absolute"
      top={56}
      right={0}
      padding={[25, 10, 10, 0]}
      space="lg"
      onMouseEnter={store.hoverEnter}
      onMouseLeave={store.hoverLeave}
      zIndex={100000000}
      pointerEvents={store.isOpen ? 'auto' : 'none'}
    >
      <OrbitDockPanel offset={0} apps={topDockApps} />
      <OrbitDockPanel offset={topDockApps.length} apps={bottomDockApps} />
    </Col>
  )
})

export const orbitDockStore = createUsableStore(OrbitDockStore)
window['orbitDockStore'] = orbitDockStore

export const OrbitDockPanel = (props: { apps: AppBit[]; offset: number }) => {
  const theme = useTheme()
  const store = orbitDockStore.useStore()
  const dockRef = useRef<HTMLElement>(null)
  const size = useNodeSize({
    ref: dockRef,
    throttle: 200,
  })

  return (
    <DockButtonPassProps>
      <Dock
        position="relative"
        flexDirection="column"
        ref={dockRef}
        pointerEvents={store.state === 'closed' ? 'none' : 'inherit'}
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
        bottom="auto"
      >
        {props.apps.map((app, index) => (
          <OrbitDockButton
            key={app.id}
            app={app}
            index={index + props.offset}
            circular={false}
            borderRadius={0}
            glint={false}
            glintBottom={false}
            {...index === 0 && {
              borderTopRadius: 8,
              borderBottomRadius: 0,
            }}
            {...index === props.apps.length - 1 && {
              borderTopRadius: 0,
              borderBottomRadius: 8,
            }}
          />
        ))}
        <FullScreen
          data-is="DockShadow"
          top={30}
          bottom={30}
          left="50%"
          right="50%"
          transform={{
            x: 50,
          }}
          borderRadius={100}
          boxShadow={[
            {
              spread: 30,
              blur: 40,
              color: theme.background.isDark() ? [30, 30, 30, 0.68] : [0, 0, 0, 0.25],
            },
          ]}
          zIndex={-1}
        />
      </Dock>
    </DockButtonPassProps>
  )
}

const OrbitDockButton = memo(function OrbitDockButton({
  index,
  app,
  ...rest
}: {
  app: AppBit
  index: number
} & Partial<DockButtonProps>) {
  const dockStore = orbitDockStore.useStore()
  const definition = getAppDefinition(app.identifier!)
  const buttonRef = useRef(null)
  const fullyOpened = useDebounceValue(dockStore.isOpen, 300)
  const nodePosition = usePosition({
    measureKey: fullyOpened,
    ref: buttonRef,
    debounce: 500,
  })
  const showMenu = dockStore.hoveredIndex === index
  const isActive = useReaction(
    () => paneManagerStore.activePane && paneManagerStore.activePane.id === `${app.id}`,
  )
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
        ref={buttonRef}
        labelProps={{
          transition: 'all ease 150ms 200ms',
          elevation: 1,
          opacity: 0,
          transform: {
            y: -10,
          },
          ...(dockStore.isOpen && {
            opacity: 1,
            transform: {
              y: 0,
            },
          }),
        }}
        onMouseMove={() => {
          if (appsDrawerStore.isOpen) return
          // wait for settle
          if (dockStore.hoveredIndex === -1) {
            dockStore.hoverEnterButton(index)
          }
        }}
        onMouseEnter={() => {
          if (appsDrawerStore.isOpen) return
          dockStore.hoverEnterButton(index)
        }}
        onMouseLeave={() => {
          dockStore.hoverLeaveButton()
        }}
        {...rest}
      />
      {nodePosition && nodePosition.rect && (
        <FloatingAppWindow
          buttonRect={nodePosition.rect}
          showMenu={showMenu}
          definition={definition}
          app={app}
          index={index}
        />
      )}
    </>
  )
})

const FloatingAppWindow = memo(({ showMenu, buttonRect, app, definition, index }: any) => {
  const [, windowHeight] = useWindowSize({ throttle: 100 })

  const width = 300
  const height = 380
  const top = buttonRect.top - 15
  const left = buttonRect.left - width - 20

  return (
    <FloatingCard
      disableDrag
      elevation={4}
      defaultWidth={width}
      defaultHeight={height}
      defaultTop={top}
      defaultLeft={left}
      bounds={{
        top: 70,
        right: 60,
        left: 20,
        bottom: 20,
      }}
      maxHeight={windowHeight - 80}
      padding={0}
      zIndex={10000000000000}
      visible={showMenu}
      pointerEvents={showMenu ? 'auto' : 'none'}
      onMouseEnter={() => {
        orbitDockStore.hoverEnterButton(index)
      }}
      onMouseLeave={() => {
        orbitDockStore.hoverLeaveButton()
      }}
      outside={<FloatingLabel visible={showMenu}>{app.name}</FloatingLabel>}
    >
      <AppViewsContext.Provider
        value={useMemo(
          () => ({
            Sidebar: DockSidebarView,
          }),
          [],
        )}
      >
        <OrbitApp
          id={app.id!}
          identifier={app.identifier!}
          appDef={definition}
          shouldRenderApp
          renderApp={DockAppRender}
          // dont let them update on search changes, etc
          isVisible={false}
        />
      </AppViewsContext.Provider>
    </FloatingCard>
  )
})

const DockAppRender = (props: RenderAppProps) => {
  return <>{props.sidebar}</>
}

const DockSidebarView = (props: AppMainViewProps) => {
  const { id } = useContext(AppLoadContext)
  return (
    <ListPassProps
      itemProps={useMemo(
        () => ({
          onClick(_, props) {
            const item = props
            if (!item) return
            orbitDockStore.close()
            om.actions.router.showAppPage({
              id: `${id}`,
              subId: (item.extraProps && item.extraProps.subId) || -1,
            })
          },
        }),
        [id],
      )}
    >
      {props.children}
    </ListPassProps>
  )
}

const FloatingLabel = gloss<{ visible?: boolean }>(Box, {
  pointerEvents: 'none',
  position: 'absolute',
  top: -40,
  left: 0,
  alignSelf: 'flex-start',
  background: [0, 0, 0, 0.95],
  color: '#fff',
  padding: [4, 8],
  borderRadius: 100,
  fontSize: 14,
  fontWeight: 600,
  textShadow: {
    x: 0,
    y: 2,
    blur: 4,
    color: 'rgba(0,0,0,0.4)',
  },
  transition: 'all ease 300ms',
  opacity: 0,
  transform: {
    y: -10,
  },
  visible: {
    opacity: 1,
    transform: {
      y: 0,
    },
  },
})

// this could work to let apps ahve their own dock items...
// const useActiveAppMenuItems = () => {
//   const orbitStore = useOrbitStore()
//   if (!orbitStore.activeAppStore) {
//     return []
//   }
//   return orbitStore.activeAppStore.menuItems || []
// }
