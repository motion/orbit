import { useReaction } from '@mcro/black'
import { isEqual } from '@mcro/fast-compare'
import { gloss } from '@mcro/gloss'
import { AppView, SubPane } from '@mcro/kit'
import { autorun, toJS } from 'mobx'
import React, { memo, useEffect, useState } from 'react'
import { useStores, useStoresSimple } from '../../hooks/useStores'
import { defaultSidebarWidth } from './OrbitSidebar'
import { OrbitStatusBarHeight } from './OrbitStatusBar'
import { OrbitToolBarHeight } from './OrbitToolBar'

export const OrbitMain = memo(function OrbitMain() {
  const { paneManagerStore } = useStores()
  console.log('render main with', paneManagerStore.panes)
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

  if (hasMain) {
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
  const { orbitStore } = useStoresSimple()
  const [appConfig, setAppConfig] = useState({})

  console.log('mounting main view', id)

  useEffect(() => {
    let tm = setTimeout(() => {
      autorun(() => {
        const next = orbitStore.activeConfig[id] || {}
        if (!isEqual(next, appConfig)) {
          console.log('next is', id, next)
          setAppConfig(toJS(next))
        }
      })
    }, 2000)
    return () => clearTimeout(tm)
  }, [])

  console.log('render with', JSON.stringify(appConfig))

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
