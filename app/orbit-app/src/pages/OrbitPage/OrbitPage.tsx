import { command, useModel } from '@o/bridge'
import { AppDefinition, AppWithDefinition, ProvideStores, showConfirmDialog, useForceUpdate, useReaction, useStore } from '@o/kit'
import { AppStatusModel, CloseAppCommand } from '@o/models'
import { App } from '@o/stores'
import { Card, ListPassProps, Loading, Row, useBanner, useGet, useParentNodeSize, useWindowSize, View, ViewProps } from '@o/ui'
import { Box, gloss } from 'gloss'
import { keyBy } from 'lodash'
import React, { memo, Suspense, useCallback, useEffect, useMemo, useRef } from 'react'
import * as ReactDOM from 'react-dom'
import { animated, useSprings } from 'react-spring'

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

// temp: used by cli as we integrate it
window['React'] = (window as any).React = React
window['ReactDOM'] = (window as any).ReactDOM = ReactDOM
window['OrbitKit'] = (window as any).OrbitUI = require('@o/kit')
window['OrbitUI'] = (window as any).OrbitUI = require('@o/ui')

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
  const allApps = om.state.apps.activeApps
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

  // current scroll
  const curX = useRef(0)
  const forceUpdate = useForceUpdate()

  // animation spring
  console.log('apps.length', apps.length)
  const [springs, set /* , _stop */] = useSprings(apps.length, i => ({
    xyz: [i * 30, 0, -i * 50],
    config: { mass: 1 + i * 2, tension: 700 - i * 100, friction: 30 + i * 20 },
  }))

  const scrollTo = offset => {
    curX.current = offset
    // @ts-ignore
    set(i => {
      console.log('got', i)
      return {
        xyz: [offset * i * 20, 0, offset * i * 10],
      }
    })
  }
  console.log('scrollTo', scrollTo)
  const paneWidth = rowSize.width / apps.length
  const getPaneWidth = useGet(paneWidth)

  const scrollToPane = (paneIndex: number) => {
    const pw = getPaneWidth()
    console.log('scrollToPane', paneIndex, pw)
    curX.current = pw * paneIndex
    forceUpdate()
    // scrollTo(set, paneWidth * paneIndex)
  }

  // listen for scroll
  const handleMove = () => {
    // stop()
    // console.log('handleScroll', rowRef.current, rowRef.current.scrollLeft, rowSize.width)
    scrollTo(rowRef.current.scrollLeft / rowSize.width)
  }

  // listen for pane movement
  useReaction(() => paneStore.paneIndex, scrollToPane)

  return (
    <Row
      flex={1}
      alignItems="center"
      justifyContent="flex-start"
      scrollable="x"
      onWheel={handleMove}
      scrollX={curX.current}
      animated
      space
      pad
      ref={rowRef}
    >
      {apps.map(({ app, definition }, index) => (
        <animated.div
          key={app.id}
          style={{
            transform: springs[index].xyz.interpolate(
              (x, y, z) =>
                `translate3d(${x}px,${y}px,0) scale(${1 - index * 0.05}) rotateZ(${z}deg)`,
            ),
            width,
            height,
          }}
        >
          <Card
            alt="flat"
            background={theme => theme.backgroundStronger}
            pad
            width={width}
            height={height}
            overflow="hidden"
            title={app.name}
          >
            <OrbitApp id={app.id} identifier={definition.id} appDef={definition} />
          </Card>
        </animated.div>
      ))}
    </Row>
  )
})

let RenderDevApp = ({ appDef }: { appDef: AppDefinition }) => {
  return <OrbitApp appDef={appDef} id={App.appConf.appId} identifier={appDef.id} hasShownOnce />
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
