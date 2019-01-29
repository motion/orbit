import { gloss, Row } from '@mcro/gloss'
import { AppType } from '@mcro/models'
import { App as AppGlobalStore } from '@mcro/stores'
import { Sidebar, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppActions } from '../../actions/AppActions'
import { apps } from '../../apps/apps'
import { AppView } from '../../apps/AppView'
import { SubPane } from '../../components/SubPane'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Pane } from '../../stores/PaneManagerStore'
import { ProvideSelectableHandlers } from '../../views/Lists/SelectableList'

export default observer(function OrbitPageContent() {
  const { orbitStore, paneManagerStore } = useStoresSafe()

  if (!orbitStore.activePane) {
    return null
  }

  React.useEffect(() => {
    return AppGlobalStore.onMessage(AppGlobalStore.messages.TOGGLE_SETTINGS, () => {
      AppActions.setOrbitDocked(true)
      paneManagerStore.setActivePaneByType('settings')
    })
  }, [])

  const activeApp = apps[orbitStore.activePane.type]
  const hasIndex = !!activeApp.index
  const hasMain = !!activeApp.main

  return (
    <Row flex={1}>
      <Sidebar
        width={hasIndex ? (hasMain ? 330 : window.innerWidth) : 0}
        minWidth={100}
        maxWidth={500}
      >
        <OrbitIndexView>
          {paneManagerStore.panes.map(pane => (
            <SubPane
              key={pane.id}
              id={pane.id}
              type={AppType[pane.type]}
              fullHeight
              padding={!hasMain ? [25, 80] : 0}
            >
              <ProvideSelectableHandlers onSelectItem={orbitStore.handleSelectItem}>
                <AppView
                  viewType="index"
                  id={pane.id}
                  type={pane.type}
                  onAppStore={orbitStore.setAppStore(pane.id)}
                />
              </ProvideSelectableHandlers>
            </SubPane>
          ))}
        </OrbitIndexView>
      </Sidebar>
      <OrbitMainView width={hasMain ? 'auto' : 0}>
        {paneManagerStore.panes.map(pane => (
          <SubPane key={pane.id} id={pane.id} type={AppType[pane.type]} fullHeight preventScroll>
            <OrbitPageMainView pane={pane} />
          </SubPane>
        ))}
      </OrbitMainView>
    </Row>
  )
})

// separate view prevents big re-renders
const OrbitPageMainView = observer(function OrbitPageMainView(props: { pane: Pane }) {
  const { orbitStore } = useStoresSafe()
  return (
    <AppView
      isActive
      viewType="main"
      id={props.pane.id}
      type={props.pane.type}
      appConfig={orbitStore.activeConfig[props.pane.type]}
    />
  )
})

const OrbitIndexView = gloss(View, {
  flex: 1,
  position: 'relative',
})

const OrbitMainView = gloss(View, {
  flex: 1,
  position: 'relative',
}).theme((_, theme) => ({
  background: theme.background,
}))
