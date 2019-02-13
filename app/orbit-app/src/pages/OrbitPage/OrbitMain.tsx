import { gloss } from '@mcro/gloss'
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
  const { paneManagerStore, appsStore } = useStores()
  const { hasMain } = appsStore.currentView

  return (
    <OrbitMainView width={hasMain ? 'auto' : 0}>
      {paneManagerStore.panes.map(pane => (
        <SubPane key={pane.id} id={pane.id} type={AppType[pane.type]} fullHeight>
          <OrbitPageMainView {...pane} />
        </SubPane>
      ))}
    </OrbitMainView>
  )
})

// separate view prevents big re-renders
const OrbitPageMainView = memo(({ type, id }: Pane) => {
  const { orbitStore } = useStores()
  const [activeConfig, setActiveConfig] = React.useState<AppConfig>(null)

  useObserver(() => {
    const appConfig = orbitStore.activeConfig[type] || null
    if (!isEqual(appConfig, activeConfig)) {
      setActiveConfig(appConfig)
    }
  })

  // TODO THIS IS WHY MAIN FLICKERS WITH WRONG PROPS:
  // we have a delay between select and show main sometimes
  // for example when you move down a list quickly it has to be debounced
  // so theres a gap there where its mismatched props
  // THE SOLUTION:
  // we have to basically keep the "old" main view in memory during that transition
  // were mid-transition in some structural stuff so perhaps this can be done more cleanly
  // but for now something like this needs to happen

  // only ever render once!
  const element = React.useMemo(
    () => {
      const confKey = activeConfig ? JSON.stringify(activeConfig) : 'none'
      const key = `${type}${id}${confKey}`
      return (
        <AppView
          key={key}
          viewType="main"
          id={id}
          type={type}
          appConfig={activeConfig}
          before={<OrbitToolBarHeight id={id} />}
          after={<OrbitStatusBarHeight id={id} />}
        />
      )
    },
    [activeConfig],
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
