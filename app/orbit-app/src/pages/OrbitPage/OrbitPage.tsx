import { Stores } from '../../om/stores'
import { command } from '@o/bridge'
import { gloss } from '@o/gloss'
import * as KIT from '@o/kit'
import { AppDefinition, showConfirmDialog, themes, ProvideStores } from '@o/kit'
import { CloseAppCommand } from '@o/models'
import { appStartupConfig, isEditing } from '@o/stores'
import * as UI from '@o/ui'
import { Loading, ProvideFocus, Theme, ListPassProps } from '@o/ui'
import { keyBy } from 'lodash'
import React, {
  memo,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect,
  useCallback,
} from 'react'
import * as ReactDOM from 'react-dom'
import { getApps } from '../../apps/orbitApps'
import MainShortcutHandler from '../../views/MainShortcutHandler'
import { querySourcesEffect } from '../../effects/querySourcesEffect'
import { useEnsureApps } from '../../effects/useEnsureApps'
import { useUserEffects } from '../../effects/userEffects'
import { useStableSort } from '../../hooks/pureHooks/useStableSort'
import { useMessageHandlers } from '../../hooks/useMessageHandlers'
import { AppWrapper } from '../../views'
import { Dock, DockButton } from './Dock'
import { LoadApp } from './LoadApp'
import { OrbitApp, OrbitAppRenderOfDefinition } from './OrbitApp'
import { OrbitAppSettingsSidebar } from './OrbitAppSettingsSidebar'
import { OrbitFloatingShareCard } from './OrbitFloatingShareCard'
import { OrbitHeader } from './OrbitHeader'
import { IS_ELECTRON } from '../../constants'
import { useThemeStore, useOrbitStore, usePaneManagerStore } from '../../om/stores'
import { useOm } from '../../om/om'
import { OrbitSearchModal } from './OrbitSearchModal'

// temp: used by cli as we integrate it
window['React'] = (window as any).React = React
window['ReactDOM'] = (window as any).ReactDOM = ReactDOM
window['OrbitKit'] = (window as any).OrbitUI = KIT
window['OrbitUI'] = (window as any).OrbitUI = UI

export const OrbitPage = memo(() => {
  const themeStore = useThemeStore()

  useLayoutEffect(() => {
    if (!IS_ELECTRON) {
      document.body.style.background = themes[themeStore.themeColor].background.toCSS()
    }
  }, [themeStore.themeColor])

  const { theme } = themeStore

  return (
    <ProvideStores stores={Stores}>
      <Theme name={themeStore.themeColor}>
        <AppWrapper
          className={`theme-${themeStore.themeColor} app-parent-bounds`}
          color={theme.color}
        >
          <ProvideFocus>
            <OrbitPageInner />
            {/* Inside provide stores to capture all our relevant stores */}
            <OrbitEffects />
          </ProvideFocus>
        </AppWrapper>
      </Theme>
    </ProvideStores>
  )
})

const OrbitEffects = memo(() => {
  useUserEffects()
  querySourcesEffect()
  useMessageHandlers()
  useEnsureApps()
  return null
})

const OrbitPageInner = memo(function OrbitPageInner() {
  const orbitStore = useOrbitStore()
  const paneManagerStore = usePaneManagerStore()
  const { actions } = useOm()

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

      if (isEditing) {
        if (shouldCloseApp || shouldCloseTab) {
          e.returnValue = false
          command(CloseAppCommand, { appId: appStartupConfig.appId })
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

  const allApps = paneManagerStore.panes.map(pane => ({
    id: pane.id,
    identifier: pane.type,
  }))

  const appsWithViews = keyBy(getApps().filter(x => !!x.app), 'id')

  const stableSortedApps = useStableSort(allApps.map(x => x.id))
    .map(id => allApps.find(x => x.id === id))
    .filter(Boolean)

  let contentArea = null

  if (isEditing) {
    contentArea = (
      <Suspense fallback={<Loading />}>
        <LoadApp RenderApp={RenderApp} bundleURL={appStartupConfig.appInDev.bundleURL} />
      </Suspense>
    )
  } else {
    contentArea = stableSortedApps
      .filter(x => appsWithViews[x.identifier])
      .map(app => <OrbitApp key={app.id} id={app.id} identifier={app.identifier} />)
  }

  const onOpen = useCallback(rows => {
    if (rows.length) {
      if (rows[0].extraData) {
        actions.router.showAppPage({ id: rows[0].extraData.id })
      }
    }
  }, [])

  return (
    <MainShortcutHandler handlers={handlers}>
      <OrbitHeader />

      <Dock>
        {/* <DockButton icon="clip" index={0} onClick={orbitStore.toggleShowAppSettings} /> */}
        <OrbitSearchModal index={1} />
        <OrbitFloatingShareCard index={2} />
      </Dock>

      <InnerChrome torn={orbitStore.isTorn}>
        <OrbitContentArea>
          <ListPassProps onOpen={onOpen}>{contentArea}</ListPassProps>
          <OrbitAppSettingsSidebar />
        </OrbitContentArea>
      </InnerChrome>
    </MainShortcutHandler>
  )
})

let RenderApp = ({ appDef }: { appDef: AppDefinition }) => {
  return <OrbitAppRenderOfDefinition appDef={appDef} id="6" identifier={appDef.id} />
}

const OrbitContentArea = gloss({
  flexFlow: 'row',
  flex: 1,
  transform: {
    z: 0,
  },
}).theme((_, theme) => ({
  // TODO test transparent
  background: theme.sidebarBackgroundTransparent || theme.sidebarBackground,
}))

const InnerChrome = gloss<{ torn?: boolean } & UI.ViewProps>(UI.View, {
  flex: 1,
  overflow: 'hidden',
  position: 'relative',
  zIndex: 3,
}).theme(({ torn }) => ({
  boxShadow: [torn ? null : [0, 0, 80, [0, 0, 0, 0.05]]],
}))
