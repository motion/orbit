import { useReaction } from '@mcro/black'
import { gloss } from '@mcro/gloss'
import { AppView, SubPane } from '@mcro/kit'
import React, { memo } from 'react'
import { useStores, useStoresSimple } from '../../hooks/useStores'
import { defaultSidebarWidth } from './OrbitSidebar'
import { OrbitStatusBarHeight } from './OrbitStatusBar'
import { OrbitToolBarHeight } from './OrbitToolBar'

export const OrbitMain = memo(function OrbitMain() {
  const { paneManagerStore } = useStores()
  return (
    <>
      {paneManagerStore.panes.map(pane => (
        <OrbitMainSubPane key={pane.id} id={pane.id} appId={pane.type} />
      ))}
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
      const { hasIndex } = appsStore.getViewState(appId)
      const isActive = paneManagerStore.activePaneLowPriority.id === id
      if (isActive) {
        return hasIndex ? sidebarStore.width : 0
      }
    },
    {
      defaultValue: defaultSidebarWidth,
    },
  )

  if (hasMain === false) {
    return null
  }

  return (
    <SubPane left={left} id={id} fullHeight>
      <OrbitPageMainView id={id} appId={appId} />
    </SubPane>
  )
})

// separate view prevents big re-renders
const OrbitPageMainView = memo(({ appId, id }: AppPane) => {
  const { orbitStore } = useStores()
  const appConfig = orbitStore.activeConfig[id] || {}
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
