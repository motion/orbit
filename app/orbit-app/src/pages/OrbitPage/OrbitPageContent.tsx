import * as React from 'react'
import { view, StoreContext, react } from '@mcro/black'
import { useStore } from '@mcro/use-store'
import { AppView } from '../../apps/AppView'
import { OrbitItemProps } from '../../views/OrbitItemProps'
import { AppConfig, AppType } from '@mcro/models'
import { PaneManagerStore } from '../../stores/PaneManagerStore'
import { View, Col, Row } from '@mcro/ui'
import { Title } from '../../views'
import { AppPanes } from '../../stores/SpaceStore'
import { SubPane } from '../../components/SubPane'
import { App } from '@mcro/stores'
import { AppActions } from '../../actions/AppActions'
import { AppStore } from '../../apps/AppStore'
import { observer } from 'mobx-react-lite'

class OrbitStore {
  props: { paneManagerStore: PaneManagerStore }

  get activePane() {
    return this.props.paneManagerStore.activePane
  }

  activeItem: AppConfig = {
    id: '',
    title: '',
    type: 'home',
  }

  updateTypeOnPaneChange = react(
    () => this.props.paneManagerStore.activePane as AppType,
    type => {
      this.activeItem = {
        ...this.activeItem,
        type,
      }
    },
  )

  handleSelectItem: OrbitItemProps<any>['onSelect'] = (_index, config) => {
    this.activeItem = config
  }

  appStores: { [key: string]: AppStore } = {}

  setAppStore = id => store => {
    this.appStores[id] = store
  }
}

export const OrbitPageContent = observer(() => {
  const { paneManagerStore } = React.useContext(StoreContext)
  const store = useStore(OrbitStore, { paneManagerStore })
  const hasItem = !!store.activeItem.id

  if (!store.activePane) {
    return null
  }

  // TODO make it a reaction inside here using mobx-react-hooks
  // setActivePaneOnTrigger = react(
  //   () => this.props.queryStore.queryInstant[0],
  //   firstChar => {
  //     for (const { type, trigger } of AppPanes) {
  //       if (trigger && trigger === firstChar) {
  //         this.props.paneManagerStore.setActivePane(type)
  //         return
  //       }
  //     }
  //   },
  // )

  React.useEffect(() => {
    return App.onMessage(App.messages.TOGGLE_SETTINGS, () => {
      AppActions.setOrbitDocked(true)
      paneManagerStore.setActivePane('settings')
    })
  }, [])

  const activeAppStore = store.appStores[store.activePane]

  return (
    <Col flex={1}>
      {!!activeAppStore ? activeAppStore.toolbar : null}
      <Row flex={1}>
        <OrbitIndexView isHidden={store.activePane === 'home'}>
          {AppPanes.map(app => (
            <SubPane id={app.id} type={app.type} key={app.type} paddingLeft={0} paddingRight={0}>
              <AppView
                viewType="index"
                id={app.id}
                type={app.type}
                itemProps={{ onSelect: store.handleSelectItem }}
                onAppStore={store.setAppStore(app.id)}
              />
            </SubPane>
          ))}
        </OrbitIndexView>
        <OrbitMainView>
          {hasItem && (
            <AppView
              key={store.activeItem.id}
              isActive
              viewType="main"
              id={store.activeItem.id}
              title={store.activeItem.title}
              type={store.activeItem.type}
              appConfig={store.activeItem}
            />
          )}
          {/* TODO could show a help pane custom to each app */}
          {!hasItem && (
            <View flex={1} alignItems="center" justifyContent="center">
              <Title>No result selected</Title>
            </View>
          )}
        </OrbitMainView>
      </Row>
    </Col>
  )
})

const OrbitIndexView = view({
  width: 300,
  position: 'relative',
  isHidden: {
    position: 'absolute',
    pointerEvents: 'none',
    visibility: 'hidden',
    zIndex: -1,
  },
}).theme(({ theme }) => ({
  borderRight: [1, theme.borderColor.alpha(0.5)],
}))

const OrbitMainView = view({
  flex: 1,
  position: 'relative',
})
