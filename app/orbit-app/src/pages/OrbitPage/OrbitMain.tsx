import { react } from '@mcro/black'
import { FullScreen } from '@mcro/gloss'
import { useHook, useStore } from '@mcro/use-store'
import { useObserver } from 'mobx-react-lite'
import React, { memo, useMemo, useState } from 'react'
import { AppType } from '../../apps/AppTypes'
import { AppView } from '../../apps/AppView'
import { SubPane } from '../../components/SubPane'
import { useStores, useStoresSimple } from '../../hooks/useStores'
import { Pane } from '../../stores/PaneManagerStore'
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

const OrbitMainSubPane = memo(({ type, id }: Pane) => {
  const { sidebarStore, paneManagerStore } = useStoresSimple()
  const { appsStore } = useStores({ debug: true })
  const { hasMain, hasIndex } = appsStore.viewsState[id] ||
    appsStore.viewsState[type] || {
      hasMain: false,
      hasIndex: false,
    }
  const [left, setLeft] = useState(0)

  useObserver(() => {
    const isActive = paneManagerStore.activePane.id === id
    const next = hasIndex ? sidebarStore.width : 0
    if (isActive && next !== left) {
      setLeft(next)
    }
  })

  const element = useMemo(
    () => {
      if (!hasMain) {
        return null
      }
      return (
        <FullScreen left={left}>
          <SubPane id={id} type={AppType[type]} fullHeight>
            <OrbitPageMainView id={id} type={type} />
          </SubPane>
        </FullScreen>
      )
    },
    [left, hasMain],
  )

  return element
})

class OrbitPageMainStore {
  props: Pane
  stores = useHook(useStoresSimple)

  appConfig = react(() => this.stores.orbitStore.activeConfig[this.props.id], _ => _)

  get key() {
    return JSON.stringify(this.appConfig)
  }
}

// separate view prevents big re-renders
const OrbitPageMainView = memo(({ type, id }: Pane) => {
  const { appConfig, key } = useStore(OrbitPageMainStore, { id })
  console.log('rendering orbit page main view', appConfig, id, key)

  if (!appConfig) {
    return null
  }

  return (
    <AppView
      key={key}
      viewType="main"
      id={id}
      type={type}
      appConfig={appConfig}
      before={<OrbitToolBarHeight id={id} />}
      after={<OrbitStatusBarHeight id={id} />}
    />
  )
})
