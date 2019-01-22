import { gloss } from '@mcro/gloss'
import { AppType } from '@mcro/models'
import { App as AppGlobalStore } from '@mcro/stores'
import { Col, Row, Sidebar, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppActions } from '../../actions/AppActions'
import AppView from '../../apps/AppView'
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

  return (
    <Col flex={1}>
      <Row flex={1}>
        <Sidebar width={300} minWidth={100} maxWidth={500}>
          <OrbitIndexView isHidden={false}>
            {paneManagerStore.panes.map(pane => (
              <SubPane key={pane.id} id={pane.id} type={AppType[pane.type]} fullHeight>
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
        <OrbitMainView>
          {paneManagerStore.panes.map(pane => (
            <SubPane key={pane.id} id={pane.id} type={AppType[pane.type]} fullHeight preventScroll>
              <OrbitPageMainView pane={pane} />
            </SubPane>
          ))}
        </OrbitMainView>
      </Row>
    </Col>
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
  isHidden: {
    position: 'absolute',
    pointerEvents: 'none',
    visibility: 'hidden',
    zIndex: -1,
  },
})

const OrbitMainView = gloss({
  flex: 1,
  position: 'relative',
}).theme((_, theme) => ({
  background: theme.background,
}))
