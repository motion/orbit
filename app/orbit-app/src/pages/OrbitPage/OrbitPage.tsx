import { command, useModel } from '@o/bridge'
import {
  AppDefinition,
  createUsableStore,
  ProvideStores,
  react,
  showConfirmDialog,
  useForceUpdate,
  useStore,
} from '@o/kit'
import { AppStatusModel, CloseAppCommand } from '@o/models'
import { App } from '@o/stores'
import { ListPassProps, Loading, useBanner, View, ViewProps } from '@o/ui'
import { Box, gloss } from 'gloss'
import React, { memo, Suspense, useCallback, useEffect, useMemo, useRef } from 'react'

import { APP_ID } from '../../constants'
import { hmrSocket } from '../../helpers/hmrSocket'
import { useOm } from '../../om/om'
import { queryStore, Stores, useThemeStore } from '../../om/stores'
import { AppWrapper } from '../../views'
import MainShortcutHandler from '../../views/MainShortcutHandler'
import { LoadApp } from './LoadApp'
import { OrbitApp } from './OrbitApp'
import { appsCarouselStore, OrbitAppsCarousel } from './OrbitAppsCarousel'
import { appsDrawerStore, OrbitAppsDrawer } from './OrbitAppsDrawer'
import { OrbitAppSettingsSidebar } from './OrbitAppSettingsSidebar'
import { OrbitDock } from './OrbitDock'
import { OrbitHeader } from './OrbitHeader'

// handle query prefixes
export const queryPrefixStore = createUsableStore(
  class QueryPrefixStore {
    setQueryPrefix = react(
      () => [appsCarouselStore.state.zoomedOut, queryStore.hasQuery, appsDrawerStore.isOpen],
      ([zoomedOut, hasQuery, drawerOpen]) => {
        if (drawerOpen) {
          queryStore.setPrefixFirstWord(false)
          return
        }
        if (!zoomedOut && !hasQuery) {
          // if youre zoomed into an app and you clear the query bar,
          // we should stop ignoring the prefix we used previosuly
          queryStore.setPrefixFirstWord(false)
          return
        }
        if (zoomedOut) {
          // ignore until we next clear the querybar
          queryStore.setPrefixFirstWord()
          return
        }
      },
    )
  },
)

export const OrbitPage = memo(() => {
  const themeStore = useThemeStore()
  return (
    <ProvideStores stores={Stores}>
      <AppWrapper className={`theme-${themeStore.themeColor}`} color={themeStore.theme.color}>
        <OrbitPageInner />
        {/* TODO: this wont load or will hit suspense/fallback if no messages are in queue i think */}
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

  let contentArea: React.ReactNode = null

  /**
   * Done by andreyy, work to get hmr working on one-off dev apps
   */
  useEffect(() => {
    if (App.appConf.appId === 0) {
      return
    }
    hmrSocket(`/appServer/${App.appConf.appId}/__webpack_hmr`, {
      built: () => {
        console.log('force updating after app server hmr')
        forceUpdate()
      },
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
    contentArea = (
      <>
        <OrbitAppsCarousel />
        <OrbitAppsDrawer />
      </>
    )
  }

  const onOpen = useCallback(rows => {
    if (rows.length) {
      if (rows[0] === undefined) debugger
      if (rows[0] && rows[0].extraData) {
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

let RenderDevApp = ({ appDef }: { appDef: AppDefinition }) => {
  return <OrbitApp appDef={appDef} id={App.appConf.appId} identifier={appDef.id} renderApp />
}

const OrbitContentArea = gloss(Box, {
  flexFlow: 'row',
  flex: 1,
  transform: {
    z: 0,
  },
})

const InnerChrome = gloss<{ torn?: boolean } & ViewProps>(View, {
  flex: 1,
  overflow: 'hidden',
  position: 'relative',
  zIndex: 3,
}).theme(({ torn }) => ({
  boxShadow: [torn ? null : [0, 0, 80, [0, 0, 0, 0.05]]],
}))
