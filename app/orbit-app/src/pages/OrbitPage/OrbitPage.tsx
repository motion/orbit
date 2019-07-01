import { command, useModel } from '@o/bridge'
import { AppDefinition, AppWithDefinition, ProvideStores, showConfirmDialog, useForceUpdate, useStore } from '@o/kit'
import { AppBit, AppStatusModel, CloseAppCommand } from '@o/models'
import { App } from '@o/stores'
import { Card, CardProps, ListPassProps, Loading, Row, useBanner, useGet, useIntersectionObserver, useOnMount, useParentNodeSize, useWindowSize, View, ViewProps } from '@o/ui'
import { Box, gloss } from 'gloss'
import { keyBy } from 'lodash'
import React, { memo, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { interpolate, useSprings } from 'react-spring'

import { getAllAppDefinitions } from '../../apps/orbitApps'
import { APP_ID } from '../../constants'
import { querySourcesEffect } from '../../effects/querySourcesEffect'
import { useEnsureStaticAppBits } from '../../effects/useEnsureStaticAppBits'
import { useUserEffects } from '../../effects/userEffects'
import { hmrSocket } from '../../helpers/hmrSocket'
import { useStableSort } from '../../hooks/pureHooks/useStableSort'
import { useOm } from '../../om/om'
import { Stores, usePaneManagerStore, useThemeStore } from '../../om/stores'
import { AppWrapper } from '../../views'
import MainShortcutHandler from '../../views/MainShortcutHandler'
import { LoadApp } from './LoadApp'
import { OrbitApp } from './OrbitApp'
import { OrbitAppSettingsSidebar } from './OrbitAppSettingsSidebar'
import { OrbitDock } from './OrbitDock'
import { OrbitHeader } from './OrbitHeader'

export const OrbitPage = memo(() => {
  const themeStore = useThemeStore()

  return (
    <ProvideStores stores={Stores}>
      <AppWrapper className={`theme-${themeStore.themeColor}`} color={themeStore.theme.color}>
        <OrbitPageInner />
        {/* Inside provide stores to capture all our relevant stores */}
        <OrbitEffects />
        {/* TODO: this wont load if no messages are in queue i think */}
        <Suspense fallback={null}>
          <OrbitStatusMessages />
        </Suspense>
      </AppWrapper>
    </ProvideStores>
  )
})

const OrbitStatusMessages = memo(() => {
  const banner = useBanner()
  const [statusMessage] = useModel(AppStatusModel, {
    appId: APP_ID,
  })

  useEffect(() => {
    if (!statusMessage) return
    banner.set({
      type: statusMessage.type,
      message: statusMessage.message,
    })
  }, [statusMessage])

  return null
})

// TODO these effects are a bad pattern, was testing them
// we should move them into another area, either in `om` or just directly onto their stores
const OrbitEffects = memo(() => {
  useEnsureStaticAppBits()
  useUserEffects()
  querySourcesEffect()
  return null
})

const OrbitPageInner = memo(function OrbitPageInner() {
  const { isEditing } = useStore(App)
  const { actions } = useOm()
  const forceUpdate = useForceUpdate()

  const shortcutState = useRef({
    closeTab: 0,
    closeApp: 0,
  })

  useEffect(() => {
    // prevent close on the main window
    window.onbeforeunload = function(e) {
      const { closeTab, closeApp } = shortcutState.current
      const shouldCloseTab = Date.now() - closeTab < 60
      const shouldCloseApp = Date.now() - closeApp < 60

      console.log('unloading!', shouldCloseApp, shouldCloseTab)

      if (App.isMainApp === false) {
        if (shouldCloseApp || shouldCloseTab) {
          e.returnValue = false
          command(CloseAppCommand, { appId: App.appConf.appId })
          return
        }
      } else {
        // MAIN APP
        // prevent on command+w
        if (shouldCloseTab) {
          e.returnValue = false
          actions.router.back()
          return
        }
        if (shouldCloseApp) {
          if (
            showConfirmDialog({
              title: 'Close Orbit?',
              message: 'This will close all sub-windows as well.',
            })
          ) {
            console.log('Bye all of orbit...')
          } else {
            e.returnValue = false
          }
        }
      }
    }
  }, [])

  const handlers = useMemo(() => {
    return {
      closeTab: () => {
        shortcutState.current.closeTab = Date.now()
      },
      closeApp: () => {
        shortcutState.current.closeApp = Date.now()
      },
    }
  }, [])

  let contentArea = null

  useEffect(() => {
    if (App.appConf.appId === 0) {
      return
    }
    hmrSocket(`/appServer/${App.appConf.appId}/__webpack_hmr`, {
      built: forceUpdate,
    })
  }, [App.appConf.appId])

  if (isEditing) {
    const bundleUrl = `${App.bundleUrl}?cacheKey=${Math.random()}`

    console.log(
      `%cEditing app id: ${App.appConf.appId} at url ${bundleUrl}`,
      'color: green; background: lightgreen; font-weight: bold;',
    )

    contentArea = (
      <Suspense fallback={<Loading message={`Loading app ${App.appConf.appId}`} />}>
        <LoadApp RenderApp={RenderDevApp} bundleURL={bundleUrl} />
      </Suspense>
    )
  } else {
    contentArea = <OrbitWorkspaceApps />
  }

  const onOpen = useCallback(rows => {
    console.log('ON OPEN', rows)
    if (rows.length) {
      if (rows[0].extraData) {
        actions.router.showAppPage({ id: rows[0].extraData.id })
      }
    }
  }, [])

  return (
    <MainShortcutHandler handlers={handlers}>
      <OrbitHeader />
      <OrbitDock />
      <InnerChrome torn={isEditing}>
        <OrbitContentArea>
          <ListPassProps onOpen={onOpen}>{contentArea}</ListPassProps>
          <OrbitAppSettingsSidebar />
        </OrbitContentArea>
      </InnerChrome>
    </MainShortcutHandler>
  )
})

// class OrbitHomeStore {
//   props: {
//     apps: AppBit[]
//   }

//   query = ''
//   setQuery = x => (this.query = x)

//   results = react(() => always(this.props.apps, this.query), this.getResults)

//   getResults() {
//     return fuzzyFilter(this.query, this.props.apps)
//   }
// }

const OrbitWorkspaceApps = memo(() => {
  const om = useOm()
  const allApps = om.state.apps.activeApps.filter(x => x.tabDisplay !== 'hidden')
  const appDefsWithViews = keyBy(getAllAppDefinitions().filter(x => !!x.app), 'id')
  const stableSortedApps = useStableSort(allApps.map(x => x.id))
    .map(id => allApps.find(x => x.id === id))
    .filter(x => !!x && !!appDefsWithViews[x.identifier])
    .map(app => ({
      app: app,
      definition: appDefsWithViews[app.identifier],
    }))
  return <OrbitAppsCarousel apps={stableSortedApps} />
})

const OrbitAppsCarousel = memo(({ apps }: { apps: AppWithDefinition[] }) => {
  const paneStore = usePaneManagerStore()
  const [sWidth, sHeight] = useWindowSize()
  const [width, height] = [sWidth * 0.8, sHeight * 0.8]
  const rowRef = useRef(null)
  const rowSize = useParentNodeSize({ ref: rowRef })

  // animation spring

  // fixing bug in react-spring
  const [mounted, setMounted] = useState(false)
  useOnMount(() => {
    setMounted(true)
  })

  const [springs, set] = useSprings(mounted ? apps.length : apps.length + 1, i => ({
    x: i * 30,
    y: 0,
    ry: -i * 50,
    config: { mass: 1 + i * 2, tension: 700 - i * 100, friction: 30 + i * 20 },
  }))

  const scrollTo = offset => {
    // @ts-ignore
    set(i => {
      return {
        x: offset * i * 20,
        y: 0,
        ry: offset * i * 10,
      }
    })
  }
  const paneWidth = rowSize.width / apps.length
  const getPaneWidth = useGet(paneWidth)

  // listen for scroll
  const handleMove = () => {
    scrollTo(rowRef.current.scrollLeft / rowSize.width)
  }

  // listen for pane movement
  useEffect(() => {
    const scrollToPane = (appId: number) => {
      const pw = getPaneWidth()
      const paneIndex = apps.findIndex(x => x.app.id === appId)
      if (paneIndex !== -1) {
        const x = pw * paneIndex
        scrollTo(x === 0 ? 0 : x / rowSize.width)
      }
    }
    scrollToPane(+paneStore.activePane.id)
  }, [paneStore.activePane.id, rowSize.width])

  return (
    <Row
      flex={1}
      alignItems="center"
      justifyContent="flex-start"
      scrollable="x"
      onWheel={handleMove}
      scrollX={springs[0].x}
      animated
      space
      padding
      ref={rowRef}
      perspective="600px"
    >
      {apps.map(({ app, definition }, index) => (
        <OrbitAppCard
          key={app.id}
          app={app}
          definition={definition}
          width={width}
          height={height}
          transform={interpolate(
            Object.keys(springs[index]).map(k => springs[index][k]),
            (x, y, ry) =>
              `translate3d(${x}px,${y}px,0) scale(${1 - index * 0.05}) rotateY(${ry}deg)`,
          )}
        />
      ))}
    </Row>
  )
})

/**
 * Handles visibility of the app as it moves in and out of viewport
 */
const OrbitAppCard = ({
  app,
  definition,
  ...cardProps
}: CardProps & { app: AppBit; definition: AppDefinition }) => {
  const cardRef = useRef(null)
  const [renderApp, setRenderApp] = useState(false)

  useIntersectionObserver({
    ref: cardRef,
    onChange(x) {
      if (x.length && x[0].isIntersecting && !renderApp) {
        setRenderApp(true)
      }
    },
  })

  return (
    <Card
      ref={cardRef}
      alt="flat"
      background={theme => theme.backgroundStronger}
      padding
      overflow="hidden"
      title={app.name}
      animated
      {...cardProps}
    >
      <OrbitApp id={app.id} identifier={definition.id} appDef={definition} renderApp={renderApp} />
    </Card>
  )
}

let RenderDevApp = ({ appDef }: { appDef: AppDefinition }) => {
  return <OrbitApp appDef={appDef} id={App.appConf.appId} identifier={appDef.id} renderApp />
}

const OrbitContentArea = gloss(Box, {
  flexFlow: 'row',
  flex: 1,
  transform: {
    z: 0,
  },
}).theme((_, theme) => ({
  // TODO test transparent
  background: theme.sidebarBackgroundTransparent || theme.sidebarBackground,
}))

const InnerChrome = gloss<{ torn?: boolean } & ViewProps>(View, {
  flex: 1,
  overflow: 'hidden',
  position: 'relative',
  zIndex: 3,
}).theme(({ torn }) => ({
  boxShadow: [torn ? null : [0, 0, 80, [0, 0, 0, 0.05]]],
}))
