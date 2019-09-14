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
import { whenIdle } from './OrbitApp'
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
  const appStore = useStore(App)
  const { actions, state } = useOm()

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

  /**
   * Warning: memo here, perf sensitive, beware closed variables
   */
  // const params = state.router.curPage.params!
  const contentArea = useMemo(() => {
    let element: React.ReactNode = null
    // if (isOnIsolateApp) {
    //   element = (
    //     <Suspense fallback={null}>
    //       <OrbitApp
    //         id={+params.id!}
    //         identifier={`${params.identifier!}`}
    //         shouldRenderApp
    //         isVisible
    //       />
    //     </Suspense>
    //   )
    // } else {
    element = (
      <Suspense fallback={null}>
        <OrbitAppsCarousel />
        <IdleLoad>{() => <OrbitAppsDrawer />}</IdleLoad>
      </Suspense>
    )
    // }
    return element
  }, [])

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

  console.warn('render OrbitPage')

  return (
    <MainShortcutHandler handlers={handlers}>
      {!false && <OrbitHeader />}
      {!false && <IdleLoad>{() => <OrbitDock />}</IdleLoad>}
      <OrbitDraggableOverlay />
      <ListPassProps onOpen={onOpen}>
        <OrbitInnerChrome
          nodeRef={innerRef}
          torn={appStore.isEditing}
          vibrancy={appStore.state.userSettings.vibrancy}
        >
          <OrbitContentArea>{contentArea}</OrbitContentArea>
        </OrbitInnerChrome>
      </ListPassProps>
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
      await sleep(80)
      await whenIdle()
      await sleep(80)
      await whenIdle()
      await when(() => !isAnimating)
      await sleep(80)
      await whenIdle()
      return true
    },
    {
      defaultValue: false,
    },
  )

  return show ? props.children() : null
}

const OrbitContentArea = gloss(Box, {
  flexDirection: 'row',
  flex: 1,
  transform: {
    z: 0,
  },
})

const OrbitInnerChrome = gloss<
  { torn?: boolean; vibrancy: typeof App.state.userSettings.vibrancy } & ViewProps
>(View, {
  flex: 1,
  overflow: 'hidden',
  position: 'relative',
  zIndex: 0,
}).theme(({ torn, vibrancy }, theme) => ({
  boxShadow: [torn ? null : [0, 0, 80, [0, 0, 0, 0.05]]],
  background: theme.orbitLauncherBackground[vibrancy || 'some'],
}))

// /**
//      * Done by andreyy, work to get hmr working on one-off dev apps
//      */
//     // useEffect(() => {
//     //   if (App.appConf.appId === 0) {
//     //     return
//     //   }
//     //   hmrSocket(`/appServer/${App.appConf.appId}/__webpack_hmr`, {
//     //     built: () => {
//     //       console.log('force updating after app server hmr')
//     //       forceUpdate()
//     //     },
//     //   })
//     // }, [App.appConf.appId])

//     if (isEditing) {
//       // const bundleUrl = `${App.bundleUrl}?cacheKey=${Math.random()}`
//       // console.log(
//       //   `%cEditing app id: ${App.appConf.windowId} at url ${bundleUrl}`,
//       //   'color: green; background: lightgreen; font-weight: bold;',
//       // )
//       // element = (
//       //   <Suspense fallback={<Loading message={`Loading app ${App.appConf.windowId}`} />}>
//       //     <LoadApp RenderApp={RenderDevApp} bundleURL={bundleUrl} />
//       //   </Suspense>
//       // )
//     }
// // let RenderDevApp = ({ appDef }: { appDef: AppDefinition }) => {
// //   return (
// //     <OrbitApp appDef={appDef} id={App.appConf.windowId} identifier={appDef.id} shouldRenderApp />
// //   )
// // }
