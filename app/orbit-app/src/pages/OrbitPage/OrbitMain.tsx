import { gloss } from '@mcro/gloss'
import { AppType } from '@mcro/models'
import { View } from '@mcro/ui'
import { isEqual } from 'lodash'
import { observer, useObserver } from 'mobx-react-lite'
import * as React from 'react'
import { AppView } from '../../apps/AppView'
import { SubPane } from '../../components/SubPane'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Pane } from '../../stores/PaneManagerStore'
import { useHasToolbar, useInspectViews } from './OrbitSidebar'
import { OrbitControlsHeight } from './OrbitToolBar'

export default observer(function OrbitMain() {
  const { paneManagerStore } = useStoresSafe()
  const { hasMain } = useInspectViews()

  if (!paneManagerStore.activePane) {
    return null
  }

  return (
    <OrbitMainView width={hasMain ? 'auto' : 0}>
      {paneManagerStore.panes.map(pane => (
        <SubPane key={pane.id} id={pane.id} type={AppType[pane.type]} fullHeight>
          <OrbitPageMainView pane={pane} />
        </SubPane>
      ))}
    </OrbitMainView>
  )
})

// separate view prevents big re-renders
function OrbitPageMainView(props: { pane: Pane }) {
  const { orbitStore } = useStoresSafe()
  const [activeConfig, setActiveConfig] = React.useState(null)
  const hasBars = useHasToolbar(props.pane.id)

  useObserver(() => {
    const appConfig = orbitStore.activeConfig[props.pane.type]
    if (!isEqual(appConfig, activeConfig)) {
      setActiveConfig(appConfig)
    }
  })

  // only ever render once!
  const element = React.useMemo(
    () => {
      console.log('rendering app view', activeConfig)
      return (
        <AppView
          key={activeConfig ? activeConfig.id : -1}
          before={hasBars && <OrbitControlsHeight />}
          viewType="main"
          id={props.pane.id}
          type={props.pane.type}
          appConfig={activeConfig}
        />
      )
    },
    [activeConfig],
  )

  return element
}

const OrbitMainView = gloss(View, {
  flex: 1,
  position: 'relative',
}).theme((_, theme) => ({
  background: theme.background,
}))
