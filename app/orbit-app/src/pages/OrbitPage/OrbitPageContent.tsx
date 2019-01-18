import { isEqual } from '@mcro/black'
import { gloss } from '@mcro/gloss'
import { AppConfig, AppType } from '@mcro/models'
import { App as AppGlobalStore } from '@mcro/stores'
import { Col, Row, Sidebar, View } from '@mcro/ui'
import { useHook, useStore } from '@mcro/use-store'
import { memoize } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppActions } from '../../actions/AppActions'
import { AppStore } from '../../apps/AppStore'
import AppView from '../../apps/AppView'
import { SelectionManager } from '../../components/SelectionManager'
import { SubPane } from '../../components/SubPane'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Pane } from '../../stores/PaneManagerStore'
import { OrbitHandleSelect } from '../../views/Lists/OrbitList'

class OrbitStore {
  stores = useHook(useStoresSafe)

  get activePane() {
    return this.stores.paneManagerStore.activePane
  }

  activeConfig: { [key: string]: AppConfig } = {
    search: { id: '', type: AppType.search, title: '' },
  }

  handleSelectItem: OrbitHandleSelect = (index, appConfig) => {
    console.log('select', index, appConfig, this.activePane)
    if (!appConfig) {
      console.warn('no app config', index)
      return
    }
    const paneType = this.activePane.type
    if (!isEqual(this.activeConfig[paneType], appConfig)) {
      this.activeConfig = {
        ...this.activeConfig,
        [paneType]: appConfig,
      }
    }
  }

  appStores: { [key: string]: AppStore<any> } = {}

  setAppStore = memoize((id: number) => (store: AppStore<any>) => {
    if (this.appStores[id] !== store) {
      this.appStores = {
        ...this.appStores,
        [id]: store,
      }
    }
  })
}

export default observer(function OrbitPageContent() {
  const { paneManagerStore } = useStoresSafe()
  const store = useStore(OrbitStore)

  if (!store.activePane) {
    return null
  }

  React.useEffect(() => {
    return AppGlobalStore.onMessage(AppGlobalStore.messages.TOGGLE_SETTINGS, () => {
      AppActions.setOrbitDocked(true)
      paneManagerStore.setActivePane(101)
    })
  }, [])

  const activeAppStore = store.appStores[store.activePane.id]

  return (
    <Col flex={1}>
      <ToolbarChrome>{!!activeAppStore ? activeAppStore.toolbar : null}</ToolbarChrome>
      <Row flex={1}>
        <Sidebar width={300} minWidth={100} maxWidth={500}>
          <OrbitIndexView isHidden={false}>
            {paneManagerStore.panes.map(pane => (
              <SubPane key={pane.id} id={pane.id} type={AppType[pane.type]} fullHeight>
                <SelectionManager paneId={pane.id}>
                  <AppView
                    viewType="index"
                    id={pane.id}
                    type={pane.type}
                    onSelectItem={store.handleSelectItem}
                    onAppStore={store.setAppStore(pane.id)}
                  />
                </SelectionManager>
              </SubPane>
            ))}
          </OrbitIndexView>
        </Sidebar>
        <OrbitMainView>
          {paneManagerStore.panes.map(pane => (
            <SubPane key={pane.id} id={pane.id} type={AppType[pane.type]} fullHeight preventScroll>
              <OrbitPageMainView store={store} pane={pane} />
            </SubPane>
          ))}
        </OrbitMainView>
      </Row>
    </Col>
  )
})

// separate view prevents big re-renders
const OrbitPageMainView = observer(function OrbitPageMainView(props: {
  store: OrbitStore
  pane: Pane
}) {
  return (
    <AppView
      isActive
      viewType="main"
      id={props.pane.id}
      type={props.pane.type}
      appConfig={props.store.activeConfig[props.pane.type]}
    />
  )
})

const ToolbarChrome = gloss({
  // minHeight: 3,
  maxHeight: 50,
}).theme((_, theme) => ({
  // borderTop: [2, theme.tabBackground],
  background: theme.background,
  borderBottom: [1, theme.borderColor.alpha(0.35)],
  // background: theme.background,
}))

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
// .theme((_, theme) => ({
//   borderRight: [1, theme.borderColor.alpha(0.5)],
//   background: theme.background.alpha(0.5),
// }))

const OrbitMainView = gloss({
  flex: 1,
  position: 'relative',
}).theme((_, theme) => ({
  background: theme.background,
}))
