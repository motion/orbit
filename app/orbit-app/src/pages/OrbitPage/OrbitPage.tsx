import { command, observeOne } from '@o/bridge'
import { OrbitHot, ProvideStores, showConfirmDialog, themes, useReaction, useStore } from '@o/kit'
import { AppCloseWindowCommand, AppDevCloseCommand, WindowMessageModel } from '@o/models'
import { App } from '@o/stores'
import { BannerHandle, ListPassProps, useBanner, View, ViewProps } from '@o/ui'
import { Box, gloss } from 'gloss'
import React, { memo, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'

import { IS_ELECTRON, WINDOW_ID } from '../../constants'
import { useOm } from '../../om/om'
import { Stores, useThemeStore } from '../../om/stores'
import { AppWrapper } from '../../views'
import MainShortcutHandler from '../../views/MainShortcutHandler'
import { OrbitApp, whenIdle } from './OrbitApp'
import { OrbitAppsCarousel } from './OrbitAppsCarousel'
import { appsCarouselStore } from './OrbitAppsCarouselStore'
import { OrbitAppsDrawer } from './OrbitAppsDrawer'
import { OrbitDock } from './OrbitDock'
import { OrbitDraggableOverlay } from './OrbitDraggableOverlay'
import { OrbitHeader } from './OrbitHeader'

// import { LoadApp } from './LoadApp'
export let GlobalBanner: BannerHandle | null = null

export default memo(function OrbitPage() {
  const themeStore = useThemeStore()
  window['GlobalBanner'] = GlobalBanner = useBanner()

  // set body background in browser mode
  useLayoutEffect(() => {
    if (!IS_ELECTRON) {
      // @ts-ignore
      document.body.style.background = themes[themeStore.themeColor].background.toString()
    }
  }, [themeStore.themeColor])

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
  const { actions, state } = useOm()
  const isOnIsolateApp = state.router.isOnIsolateApp

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
    // const bundleUrl = `${App.bundleUrl}?cacheKey=${Math.random()}`
    // console.log(
    //   `%cEditing app id: ${App.appConf.windowId} at url ${bundleUrl}`,
    //   'color: green; background: lightgreen; font-weight: bold;',
    // )
    // contentArea = (
    //   <Suspense fallback={<Loading message={`Loading app ${App.appConf.windowId}`} />}>
    //     <LoadApp RenderApp={RenderDevApp} bundleURL={bundleUrl} />
    //   </Suspense>
    // )
  } else {
    if (isOnIsolateApp) {
      const params = state.router.curPage.params!
      contentArea = (
        <Suspense fallback={null}>
          <OrbitApp
            id={+params.id!}
            identifier={`${params.identifier!}`}
            shouldRenderApp
            isVisible
          />
          {/* <IdleLoad>{() => <OrbitAppsDrawer />}</IdleLoad> */}
        </Suspense>
      )
    } else {
      contentArea = (
        <Suspense fallback={null}>
          <OrbitAppsCarousel />
          <IdleLoad>{() => <OrbitAppsDrawer />}</IdleLoad>
        </Suspense>
      )
    }
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
      {!isOnIsolateApp && <OrbitHeader />}
      {!isOnIsolateApp && <OrbitDock />}
      <OrbitDraggableOverlay />
      <OrbitInnerChrome nodeRef={innerRef} torn={isEditing}>
        <OrbitContentArea>
          <ListPassProps onOpen={onOpen}>{contentArea}</ListPassProps>
        </OrbitContentArea>
      </OrbitInnerChrome>
    </MainShortcutHandler>
  )
})

const IdleLoad = (props: { children: () => React.ReactElement }) => {
  const show = useReaction(
    () => appsCarouselStore.isAnimating,
    async (isAnimating, { sleep, when, getValue }) => {
      if (getValue() === true) {
        return true
      }
      await sleep(100)
      await whenIdle()
      await sleep(100)
      await whenIdle()
      await when(() => !isAnimating)
      await sleep(100)
      await whenIdle()
      console.log('loading', props)
      return true
    },
    {
      defaultValue: false,
    },
  )

  return show ? props.children() : null
}

// let RenderDevApp = ({ appDef }: { appDef: AppDefinition }) => {
//   return (
//     <OrbitApp appDef={appDef} id={App.appConf.windowId} identifier={appDef.id} shouldRenderApp />
//   )
// }

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
