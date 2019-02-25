import { useReaction } from '@mcro/black'
import { gloss } from '@mcro/gloss'
import { AppView, SubPane } from '@mcro/kit'
import { useStoreDebug } from '@mcro/use-store'
import { toJS } from 'mobx'
import React, { memo, useMemo } from 'react'
import { useStores, useStoresSimple } from '../../hooks/useStores'
import { defaultSidebarWidth } from './OrbitSidebar'
import { OrbitStatusBarHeight } from './OrbitStatusBar'
import { OrbitToolBarHeight } from './OrbitToolBar'

export default memo(function OrbitMain() {
  const { paneManagerStore } = useStores()
  return (
    <>
      {paneManagerStore.panes.map(pane => {
        return <OrbitMainSubPane key={pane.id} id={pane.id} appId={pane.type} />
      })}
    </>
  )
})

type AppPane = { id: string; appId: string }

const OrbitMainSubPane = memo(({ appId, id }: AppPane) => {
  const { sidebarStore, paneManagerStore } = useStoresSimple()
  const { appsStore } = useStores()
  const { hasMain } = appsStore.getViewState(appId)

  const left = useReaction(
    () => {
      // 🐛 this wont react if you use getViewState, but useObserver it will 🤷‍♂️
      const { hasIndex } = appsStore.viewsState[id] || { hasIndex: false }
      const isActive = paneManagerStore.activePaneLowPriority.id === id
      if (isActive) {
        return hasIndex ? sidebarStore.width : 0
      }
    },
    {
      defaultValue: defaultSidebarWidth,
    },
  )

  const element = useMemo(
    () => {
      if (!hasMain) {
        return null
      }
      return (
        <SubPane left={left} id={id} /* debug={id === 'createApp'} */ fullHeight>
          <OrbitPageMainView id={id} appId={appId} />
        </SubPane>
      )
    },
    [left, hasMain],
  )

  return element
})

// separate view prevents big re-renders
const OrbitPageMainView = memo(({ appId, id }: AppPane) => {
  useStoreDebug()
  const { orbitStore } = useStores()
  const appConfig = toJS(orbitStore.activeConfig[id])
  console.log('123, load main', appId, id, appConfig)
  return (
    <OrbitMainContainer isTorn={orbitStore.isTorn}>
      <AppView
        key={JSON.stringify(appConfig)}
        id={id}
        appId={appId}
        viewType="main"
        appConfig={appConfig}
        before={<OrbitToolBarHeight appId={appId} />}
        after={<OrbitStatusBarHeight appId={appId} />}
      />
    </OrbitMainContainer>
  )
})

const OrbitMainContainer = gloss<{ isTorn: boolean }>({
  flex: 1,
}).theme(({ isTorn }, theme) => ({
  background: isTorn
    ? theme.mainBackground || theme.background
    : theme.mainBackground || 'transparent',
}))
