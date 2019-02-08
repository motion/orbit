import { gloss } from '@mcro/gloss'
import { View } from '@mcro/ui'
import { isEqual } from 'lodash'
import { useObserver } from 'mobx-react-lite'
import * as React from 'react'
import { AppConfig, AppType } from '../../apps/AppTypes'
import { AppView, useApp } from '../../apps/AppView'
import { SubPane } from '../../components/SubPane'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Pane } from '../../stores/PaneManagerStore'
import { useInspectViews } from './OrbitSidebar'
import { OrbitStatusBarHeight } from './OrbitStatusBar'
import { OrbitControlsHeight } from './OrbitToolBar'

export default function OrbitMain() {
  const { paneManagerStore } = useStoresSafe()
  const { hasMain } = useInspectViews()

  return (
    <OrbitMainView width={hasMain ? 'auto' : 0}>
      {paneManagerStore.panes.map(pane => (
        <SubPane key={pane.id} id={pane.id} type={AppType[pane.type]} fullHeight>
          <OrbitPageMainView pane={pane} />
        </SubPane>
      ))}
    </OrbitMainView>
  )
}

// separate view prevents big re-renders
function OrbitPageMainView(props: { pane: Pane }) {
  const { orbitStore } = useStoresSafe()
  const [activeConfig, setActiveConfig] = React.useState<AppConfig>(null)
  const { appViews } = useApp(activeConfig)

  useObserver(() => {
    const appConfig = orbitStore.activeConfig[props.pane.type]
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
      if (!appViews) {
        return null
      }
      const key = `${JSON.stringify(props.pane)}${
        activeConfig ? `${activeConfig.id}${activeConfig.type}` : 'none'
      }`
      return (
        <React.Fragment key={key}>
          {appViews.toolBar && <OrbitControlsHeight />}
          <OrbitMainBackground>
            <AppView
              viewType="main"
              id={props.pane.id}
              type={props.pane.type}
              appConfig={activeConfig}
            />
          </OrbitMainBackground>

          {appViews.statusBar && <OrbitStatusBarHeight />}
        </React.Fragment>
      )
    },
    [activeConfig, appViews],
  )

  return element
}

const OrbitMainView = gloss(View, {
  flex: 1,
  position: 'relative',
})

const OrbitMainBackground = gloss({
  flex: 1,
  position: 'relative',
}).theme((_, theme) => ({
  background: theme.background,
}))
