import { FullScreen } from '@mcro/gloss'
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

// separate view prevents big re-renders
const OrbitPageMainView = memo(({ type, id }: Pane) => {
  const { orbitStore } = useStores()
  const appConfig = orbitStore.activeConfig[id] || null
  const confKey = appConfig ? JSON.stringify(appConfig) : 'none'

  // only ever render once per config!
  const element = React.useMemo(
    () => {
      if (!appConfig) {
        return null
      }
      console.log('appConfig', appConfig)
      return (
        <AppView
          viewType="main"
          id={id}
          type={type}
          appConfig={appConfig}
          before={<OrbitToolBarHeight id={id} />}
          after={<OrbitStatusBarHeight id={id} />}
        />
      )
    },
    [confKey],
  )

  return element
})
