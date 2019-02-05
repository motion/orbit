import { gloss } from '@mcro/gloss'
import { AppType } from '@mcro/models'
import { View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { apps } from '../../apps/apps'
import { AppView } from '../../apps/AppView'
import { SubPane } from '../../components/SubPane'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Pane } from '../../stores/PaneManagerStore'

export default observer(function OrbitMain() {
  const { orbitStore, paneManagerStore } = useStoresSafe()

  if (!orbitStore.activePane) {
    return null
  }

  const activeApp = apps[orbitStore.activePane.type]
  const hasMain = !!activeApp.main

  return (
    <OrbitMainView width={hasMain ? 'auto' : 0}>
      {paneManagerStore.panes.map(pane => (
        <SubPane key={pane.id} id={pane.id} type={AppType[pane.type]} fullHeight preventScroll>
          <OrbitPageMainView pane={pane} />
        </SubPane>
      ))}
    </OrbitMainView>
  )
})

// separate view prevents big re-renders
const OrbitPageMainView = observer(function OrbitPageMainView(props: { pane: Pane }) {
  const { orbitStore } = useStoresSafe()
  const appConfig = orbitStore.activeConfig[props.pane.type]

  if (!appConfig) {
    return null
  }

  return <AppView viewType="main" id={props.pane.id} type={props.pane.type} appConfig={appConfig} />
})

const OrbitMainView = gloss(View, {
  flex: 1,
  position: 'relative',
}).theme((_, theme) => ({
  background: theme.background,
}))
