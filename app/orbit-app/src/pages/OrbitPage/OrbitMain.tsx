import { FullScreen, gloss } from '@mcro/gloss'
import { View } from '@mcro/ui'
import { isEqual } from 'lodash'
import { useObserver } from 'mobx-react-lite'
import React, { memo } from 'react'
import { AppConfig, AppType } from '../../apps/AppTypes'
import { AppView } from '../../apps/AppView'
import { SubPane } from '../../components/SubPane'
import { useStores } from '../../hooks/useStores'
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
  const { appsStore, sidebarStore } = useStores()
  const { hasMain, hasIndex } = appsStore.viewsState[id] ||
    appsStore.viewsState[type] || {
      hasMain: false,
      hasIndex: false,
    }
  if (!hasMain) {
    return null
  }
  return (
    <FullScreen left={hasIndex ? sidebarStore.width : 0}>
      <SubPane id={id} type={AppType[type]} fullHeight>
        <OrbitPageMainView id={id} type={type} />
      </SubPane>
    </FullScreen>
  )
})

// separate view prevents big re-renders
const OrbitPageMainView = memo(({ type, id }: Pane) => {
  const { orbitStore } = useStores()
  const [activeConfig, setActiveConfig] = React.useState<AppConfig>(null)
  const confKey = activeConfig ? JSON.stringify(activeConfig) : 'none'

  useObserver(() => {
    const appConfig = orbitStore.activeConfig[type] || null
    if (!isEqual(appConfig, activeConfig)) {
      setActiveConfig(appConfig)
    }
  })

  // only ever render once per config!
  const element = React.useMemo(
    () => {
      return (
        <AppView
          viewType="main"
          id={id}
          type={type}
          appConfig={activeConfig}
          before={<OrbitToolBarHeight id={id} />}
          after={<OrbitStatusBarHeight id={id} />}
        />
      )
    },
    [confKey],
  )

  return element
})

// background above so it doest flicker on change
const OrbitMainView = gloss(View, {
  flex: 1,
  position: 'relative',
}).theme((_, theme) => ({
  background: theme.background,
}))
