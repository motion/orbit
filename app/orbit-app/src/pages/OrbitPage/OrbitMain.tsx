import { useReaction } from '@mcro/black'
import { gloss } from '@mcro/gloss'
import { AppView, SubPane } from '@mcro/kit'
import { BorderLeft } from '@mcro/ui'
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
        <OrbitMainSubPane key={pane.id} id={pane.id} identifier={pane.type} />
      ))}
    </>
  )
})

type AppPane = { id: string; identifier: string }

const OrbitMainSubPane = memo(({ identifier, id }: AppPane) => {
  const { sidebarStore, paneManagerStore } = useStoresSimple()
  const { appsStore } = useStores()
  const { hasMain } = appsStore.getViewState(identifier)

  const left = useReaction(
    () => {
      // 🐛 this wont react if you use getViewState, but useObserver it will 🤷‍♂️
      const { hasIndex } = appsStore.getViewState(identifier)
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
    <SubPane left={left} id={id} fullHeight zIndex={10}>
      <OrbitPageMainView id={id} identifier={identifier} />
    </SubPane>
  )
})

// separate view prevents big re-renders
const OrbitPageMainView = memo(({ identifier, id }: AppPane) => {
  const { orbitStore } = useStores()
  const appConfig = orbitStore.activeConfig[id] || {}
  return (
    <>
      <OrbitToolBarHeight identifier={identifier} />
      <OrbitMainContainer isTorn={orbitStore.isTorn}>
        <AppView
          key={JSON.stringify(appConfig)}
          id={id}
          identifier={identifier}
          viewType="main"
          appConfig={appConfig}
          inside={<BorderLeft opacity={0.5} />}
          after={<OrbitStatusBarHeight identifier={identifier} />}
        />
      </OrbitMainContainer>
    </>
  )
})

const OrbitMainContainer = gloss<{ isTorn: boolean }>({
  flex: 1,
}).theme(({ isTorn }, theme) => ({
  background: isTorn
    ? theme.mainBackground || theme.background
    : theme.mainBackground || theme.background || 'transparent',
}))
