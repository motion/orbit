import { command, observeOne } from '@o/bridge'
import { AppDefinition, OrbitHot, ProvideStores, showConfirmDialog, useStore } from '@o/kit'
import { AppCloseWindowCommand, AppDevCloseCommand, WindowMessageModel } from '@o/models'
import { App } from '@o/stores'
import { BannerHandle, ListPassProps, Loading, useBanner, View, ViewProps } from '@o/ui'
import { Box, gloss } from 'gloss'
import React, { memo, Suspense, useCallback, useEffect, useMemo, useRef } from 'react'

import { IS_ELECTRON, WINDOW_ID } from '../../constants'
import { useOm } from '../../om/om'
import { Stores, useThemeStore } from '../../om/stores'
import { SearchStore } from '../../stores/SearchStore'
import { AppWrapper } from '../../views'
import MainShortcutHandler from '../../views/MainShortcutHandler'
import { LoadApp } from './LoadApp'
import { OrbitApp } from './OrbitApp'
import { OrbitAppsCarousel } from './OrbitAppsCarousel'
import { OrbitAppsDrawer } from './OrbitAppsDrawer'
import { OrbitDock } from './OrbitDock'
import { OrbitDraggableOverlay } from './OrbitDraggableOverlay'
import { OrbitHeader } from './OrbitHeader'

export let GlobalBanner: BannerHandle | null = null

export const OrbitPage = memo(function OrbitPage() {
  const themeStore = useThemeStore()
  window['GlobalBanner'] = GlobalBanner = useBanner()
  return (
    <ProvideStores stores={Stores}>
      <SearchStore.Provider>
        <AppWrapper className={`theme-${themeStore.themeColor}`} color={themeStore.theme.color}>
          <OrbitPageInner />
          {/* TODO: this wont load or will hit suspense/fallback if no messages are in queue i think */}
          <Suspense fallback={null}>
            <OrbitStatusMessages />
          </Suspense>
        </AppWrapper>
      </SearchStore.Provider>
    </ProvideStores>
  )
})

const OrbitStatusMessages = memo(() => {
  const banner = useBanner()

  useEffect(() => {
    observeOne(WindowMessageModel, {
      args: {
        windowId: WINDOW_ID,
      },
    }).subscribe(message => {
      console.log('message', message)
      banner.set({
        type: message.type,
        title: message.title,
        message: message.message,
        timeout: message.timeout,
        loading: message.loading,
      })
    })
  }, [])

  return null
})

const OrbitPageInner = memo(function OrbitPageInner() {
  const { isEditing } = useStore(App)
  const { actions } = useOm()

  const shortcutState = useRef({
    closeTab: 0,
    closeApp: 0,
  })

  useEffect(() => {
    // prevent close on the main window
    window.addEventListener('beforeunload', e => {
      OrbitHot.removeAllHotHandlers()
      const { closeTab, closeApp } = shortcutState.current
      const shouldCloseTab = Date.now() - closeTab < 60
      const shouldCloseApp = Date.now() - closeApp < 60
      console.log('unloading!', shouldCloseApp, shouldCloseTab)
      if (IS_ELECTRON) {
        if (App.isMainApp === false) {
          if (shouldCloseApp || shouldCloseTab) {
            e.returnValue = false
            command(AppCloseWindowCommand, { windowId: App.appConf.windowId })
            if (App.isEditing) {
              command(AppDevCloseCommand, { identifier: App.appConf.identifier })
            }
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
    })
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
  // useEffect(() => {
  //   if (App.appConf.appId === 0) {
  //     return
  //   }
  //   hmrSocket(`/appServer/${App.appConf.appId}/__webpack_hmr`, {
  //     built: () => {
  //       console.log('force updating after app server hmr')
  //       forceUpdate()
  //     },
  //   })
  // }, [App.appConf.appId])

  if (isEditing) {
    const bundleUrl = `${App.bundleUrl}?cacheKey=${Math.random()}`
    console.log(
      `%cEditing app id: ${App.appConf.windowId} at url ${bundleUrl}`,
      'color: green; background: lightgreen; font-weight: bold;',
    )
    contentArea = (
      <Suspense fallback={<Loading message={`Loading app ${App.appConf.windowId}`} />}>
        <LoadApp RenderApp={RenderDevApp} bundleURL={bundleUrl} />
      </Suspense>
    )
  } else {
    contentArea = (
      <Suspense fallback={null}>
        <OrbitAppsCarousel />
        <OrbitAppsDrawer />
      </Suspense>
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

  // bugfix: sometimes this node would get scrolled even though its overflow hidden
  const innerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!innerRef.current) return
    innerRef.current!.addEventListener('scroll', () => {
      innerRef.current!.scrollTop = 0
    })
  }, [innerRef])

  return (
    <MainShortcutHandler handlers={handlers}>
      <OrbitHeader />
      <OrbitDock />
      <OrbitDraggableOverlay />
      <OrbitInnerChrome ref={innerRef} torn={isEditing}>
        <OrbitContentArea>
          <ListPassProps onOpen={onOpen}>{contentArea}</ListPassProps>
        </OrbitContentArea>
      </OrbitInnerChrome>
    </MainShortcutHandler>
  )
})

let RenderDevApp = ({ appDef }: { appDef: AppDefinition }) => {
  return (
    <OrbitApp appDef={appDef} id={App.appConf.windowId} identifier={appDef.id} shouldRenderApp />
  )
}

const OrbitContentArea = gloss(Box, {
  flexFlow: 'row',
  flex: 1,
  transform: {
    z: 0,
  },
})

const OrbitInnerChrome = gloss<{ torn?: boolean } & ViewProps>(View, {
  flex: 1,
  overflow: 'hidden',
  position: 'relative',
  zIndex: 3,
}).theme(({ torn }, theme) => ({
  boxShadow: [torn ? null : [0, 0, 80, [0, 0, 0, 0.05]]],
  background: theme.orbitLauncherBackground,
}))
