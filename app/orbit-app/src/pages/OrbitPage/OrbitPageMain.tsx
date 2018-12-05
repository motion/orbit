import * as React from 'react'
import { view, StoreContext, react } from '@mcro/black'
import { OrbitPaneManager } from './OrbitPaneManager'
import { useStore } from '@mcro/use-store'
import { AppView } from '../../apps/AppView'
import { OrbitItemProps } from '../../views/OrbitItemProps'
import { AppConfig, AppType } from '@mcro/models'
import { PaneManagerStore } from '../../stores/PaneManagerStore'
import { View } from '@mcro/ui'
import { Title } from '../../views'

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

  handleSelectItem: OrbitItemProps<any>['onSelect'] = (index, config) => {
    console.log('select item at', index)
    this.activeItem = config
  }
}

export const OrbitPageMain = React.memo(() => {
  const { paneManagerStore } = React.useContext(StoreContext)
  const store = useStore(OrbitStore, { paneManagerStore })
  if (!store.activePane) {
    return null
  }
  const hasItem = !!store.activeItem.id
  return (
    <>
      <OrbitIndexView isHidden={store.activePane === 'home'}>
        <OrbitPaneManager onSelectItem={store.handleSelectItem} />
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
    </>
  )
})

const OrbitIndexView = view({
  width: 300,
  isHidden: {
    display: 'none',
  },
}).theme(({ theme }) => ({
  borderRight: [1, theme.borderColor.alpha(0.5)],
}))

const OrbitMainView = view({
  flex: 1,
  position: 'relative',
})
