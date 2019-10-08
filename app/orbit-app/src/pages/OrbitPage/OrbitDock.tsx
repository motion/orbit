import { AppBit, AppLoadContext, AppMainViewProps, AppViewsContext, getAppDefinition, RenderAppProps, useActiveUser, useReaction, useStore } from '@o/kit'
import { App } from '@o/stores'
import { Divider, Dock, DockButton, DockButtonProps, FloatingCard, ListPassProps, memoizeWeak, Stack, useDebounceValue, usePosition, useWindowSize, View } from '@o/ui'
import { Box, gloss } from 'gloss'
import { partition } from 'lodash'
import React, { memo, useContext, useMemo, useRef } from 'react'

import { useOm } from '../../om/om'
import { appsDrawerStore, paneManagerStore, useAppsDrawerStore } from '../../om/stores'
import { dockWidth } from './dockWidth'
import { OrbitApp } from './OrbitApp'
import { OrbitDockStore, orbitDockStore } from './OrbitDockStore'

const dockRightSpace = (dockWidth - 38) / 2

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
    <>
      <Stack
        position="absolute"
        top={70}
        right={0}
        bottom={15}
        space="lg"
        onMouseEnter={store.hoverEnter}
        onMouseLeave={store.hoverLeave}
        zIndex={100000000}
        pointerEvents={store.state === 'closed' ? 'none' : 'inherit'}
        transform={
          store.isOpen
            ? {
                x: 0,
              }
            : {
                x: '100%',
              }
        }
        transition={store.isOpen ? `all ease 300ms` : `all ease-out 300ms 150ms`}
      >
        <OrbitDockPanel offset={0} apps={topDockApps} />

        <View width={dockWidth * 0.8} marginRight={dockWidth * 0.1} alignSelf="flex-end">
          <Divider />
        </View>

        <OrbitDockPanel offset={topDockApps.length} apps={bottomDockApps} />

        <View width={dockWidth * 0.8} marginRight={dockWidth * 0.1} alignSelf="flex-end">
          <Divider />
        </View>

        <Dock
          right={dockRightSpace}
          space="sm"
          position="relative"
          direction="vertical"
          bottom="auto"
        >
          <DockThemeButton index={topDockApps.length + bottomDockApps.length} />
          <DockVibrancyButton index={topDockApps.length + bottomDockApps.length + 1} />
        </Dock>
      </Stack>
      <DockBackground isOpen={store.isOpen} elevation={3} />
    </>
  )
})

const DockBackground = gloss<{ isOpen: boolean }, typeof View>(View, {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  width: dockWidth,
  // above OrbitAppsDrawer, below OrbitHeader
  zIndex: 4,
  transition: `all ease-out 300ms 150ms`,
  opacity: 0,
  transform: {
    x: '100%',
  },

  isOpen: {
    transition: `all ease 300ms`,
    opacity: 1,
    transform: {
      x: 0,
    },
  },
}).theme((_, theme) => ({
  background: theme.background.setAlpha(0.75),
}))

export const OrbitDockPanel = (props: { apps: AppBit[]; offset: number }) => {
  const [, windowHeight] = useWindowSize({ throttle: 300 })
  return (
    <Dock
      right={dockRightSpace}
      position="relative"
      direction="vertical"
      className="orbit-dock-panel"
      bottom="auto"
    >
      {props.apps.map((app, index) => (
        <OrbitDockButton
          key={app.id}
          app={app}
          index={index + props.offset}
          circular={false}
          borderRadius={0}
          glintBottom={false}
          windowHeight={windowHeight}
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
    </Dock>
  )
}

const dockButtonProps = memoizeWeak(
  (index: number, dockStore: OrbitDockStore, showLabel: boolean): Partial<DockButtonProps> => {
    return {
      background: 'transparent',
      glint: false,
      elevation: 0,
      space: 16,
      showLabelOnHover: true,
      onMouseMove: () => {
        if (appsDrawerStore.isOpen) return
        // wait for settle
        if (dockStore.hoveredIndex === -1) {
          dockStore.hoverEnterButton(index)
        }
      },
      onMouseEnter: () => {
        if (appsDrawerStore.isOpen) return
        dockStore.hoverEnterButton(index)
      },
      onMouseLeave: () => {
        dockStore.hoverLeaveButton()
      },
      labelProps: {
        transition: `all ease-out 80ms ${100 - index * 30}ms`,
        background: [0, 0, 0, 0.65],
        elevation: 1,
        opacity: 0,
        transform: {
          y: -10,
        },
        ...(showLabel &&
          dockStore.isOpen && {
            transition: `all ease-out 400ms ${230 + index * 30}ms`,
            opacity: 1,
            transform: {
              y: 0,
            },
          }),
        hoverStyle: {
          transition: `all ease-out 200ms`,
          opacity: 1,
          transform: {
            y: 0,
          },
        },
      },
    }
  },
)

const themes = [
  { name: 'Auto', value: 'automatic', icon: 'right-join' },
  { name: 'Dark', value: 'dark', icon: 'moon' },
  { name: 'Light', value: 'light', icon: 'flash' },
] as const

const DockThemeButton = memo(({ index }: { index: number }) => {
  const dockStore = orbitDockStore.useStore()
  const [user, updateUser] = useActiveUser()
  const curTheme = user!.settings!.theme
  const themeIndex = themes.findIndex(x => x.value === curTheme)
  const theme = themes[themeIndex]
  return (
    <DockButton
      id="theme-mode"
      onClick={() =>
        updateUser(x => {
          x.settings!.theme = themes[(themeIndex + 1) % themes.length].value
        })
      }
      icon={theme.icon}
      label={`Theme: ${theme.name}`}
      showLabelOnHover
      {...dockButtonProps(index, dockStore, false)}
    />
  )
})

const vibrancies = [
  { name: 'More', value: 'more', icon: 'circle' },
  { name: 'Some', value: 'some', icon: 'selection' },
  { name: 'None', value: 'none', icon: 'full-circle' },
] as const

const DockVibrancyButton = memo(({ index }: { index: number }) => {
  const dockStore = orbitDockStore.useStore()
  const [user, updateUser] = useActiveUser()
  const curVibrancy = user!.settings!.vibrancy || 'some'
  const vibrancyIndex = vibrancies.findIndex(x => x.value === curVibrancy)
  const vibrancy = vibrancies[vibrancyIndex]

  return (
    <DockButton
      id="vibrancy-mode"
      onClick={() =>
        updateUser(x => {
          x.settings!.vibrancy = vibrancies[(vibrancyIndex + 1) % vibrancies.length].value
        })
      }
      showLabelOnHover
      icon={vibrancy.icon}
      label={`Vibrancy: ${vibrancy.name}`}
      {...dockButtonProps(index, dockStore, false)}
    />
  )
})

const OrbitDockButton = memo(function OrbitDockButton({
  index,
  app,
  windowHeight,
  ...rest
}: {
  app: AppBit
  index: number
  windowHeight: number
} & Partial<DockButtonProps>) {
  const drawerStore = useAppsDrawerStore()
  const dockStore = orbitDockStore.useStore()
  const definition = getAppDefinition(app.identifier!)!
  const buttonRef = useRef(null)
  const om = useOm()
  const fullyOpened = useDebounceValue(dockStore.isOpen, 300)
  const nodePosition = usePosition({
    measureKey: fullyOpened,
    ref: buttonRef,
    debounce: 300,
  })
  const showMenu = dockStore.hoveredIndex === index
  const isActive = useReaction(
    () => paneManagerStore.activePane && paneManagerStore.activePane.id === `${app.id}`,
  )
  return (
    <>
      <DockButton
        id={`${app.id}`}
        opacity={isActive ? 1 : drawerStore.isOpen ? 0.75 : 0.85}
        hoverStyle={{
          opacity: 1,
        }}
        onClick={useMemo(() => {
          om.actions.router.showAppPage({ id: `${app.id!}` })
        }, [app])}
        icon={definition.icon || 'layers'}
        label={app.name}
        nodeRef={buttonRef}
        {...dockButtonProps(index, dockStore, !drawerStore.isOpen)}
        {...rest}
      />
      {nodePosition && (
        <FloatingAppWindow
          windowHeight={windowHeight}
          buttonRect={nodePosition}
          showMenu={showMenu}
          definition={definition}
          app={app}
          index={index}
        />
      )}
    </>
  )
})

const bounds = {
  top: 70,
  right: 60,
  left: 20,
  bottom: 20,
}
const FloatingAppWindow = memo(
  ({ showMenu, buttonRect, app, definition, index, windowHeight }: any) => {
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
        bounds={bounds}
        maxHeight={windowHeight - 80}
        padding={0}
        zIndex={10000000000000}
        visible={showMenu}
        pointerEvents={showMenu ? 'auto' : 'none'}
        onMouseEnter={
          useMemo(() => {
            orbitDockStore.hoverEnterButton(index)
          }, [index]) as any
        }
        onMouseLeave={
          useMemo(() => {
            orbitDockStore.hoverLeaveButton()
          }, []) as any
        }
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
  },
)

const DockAppRender = (props: RenderAppProps) => {
  return <>{props.sidebar}</>
}

const DockSidebarView = (props: AppMainViewProps) => {
  const { id } = useContext(AppLoadContext)
  const om = useOm()

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
  top: -30,
  left: 0,
  alignSelf: 'flex-start',
  background: [0, 0, 0, 0.8],
  color: '#fff',
  padding: [2, 6],
  borderRadius: 100,
  fontSize: 12,
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
