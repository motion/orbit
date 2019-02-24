import { react, useReaction } from '@mcro/black'
import { gloss } from '@mcro/gloss'
import { AppView, PaneManagerPane, SubPane } from '@mcro/kit'
import { useHook, useStore } from '@mcro/use-store'
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
        return <OrbitMainSubPane key={pane.id} {...pane} />
      })}
    </>
  )
})

const OrbitMainSubPane = memo(({ type, id }: PaneManagerPane) => {
  const { sidebarStore, paneManagerStore } = useStoresSimple()
  const { appsStore } = useStores()
  const { hasMain } = appsStore.getViewState(id)

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
          <OrbitPageMainView id={id} type={type} />
        </SubPane>
      )
    },
    [left, hasMain],
  )

  return element
})

class OrbitPageMainStore {
  props: PaneManagerPane
  stores = useHook(useStoresSimple)

  appConfig = react(() => this.stores.orbitStore.activeConfig[this.props.id], _ => _)

  get key() {
    return JSON.stringify(this.appConfig)
  }
}

// separate view prevents big re-renders
const OrbitPageMainView = memo(({ type, id }: PaneManagerPane) => {
  const { orbitStore } = useStores()
  const { appConfig, key } = useStore(OrbitPageMainStore, { id, type })
  return (
    <OrbitMainContainer isTorn={orbitStore.isTorn}>
      <AppView
        key={key}
        appId={type}
        viewType="main"
        appConfig={appConfig}
        before={<OrbitToolBarHeight appId={type} />}
        after={<OrbitStatusBarHeight appId={type} />}
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
