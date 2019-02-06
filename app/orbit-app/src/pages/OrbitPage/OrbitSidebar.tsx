import { gloss } from '@mcro/gloss'
import { AppType } from '@mcro/models'
import { Sidebar, View } from '@mcro/ui'
import { isEqual } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { apps } from '../../apps/apps'
import { AppView, AppViewRef } from '../../apps/AppView'
import { OrbitToolBarContext } from '../../components/OrbitToolbar'
import { SubPane } from '../../components/SubPane'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Pane } from '../../stores/PaneManagerStore'
import { BorderTop } from '../../views/Border'
import { ProvideSelectableHandlers } from '../../views/Lists/SelectableList'
import { OrbitControlsHeight } from './OrbitControls'

type AppViewRefDictionary = { [key: string]: AppViewRef }

export default observer(function OrbitSidebar() {
  const { orbitStore, paneManagerStore } = useStoresSafe()
  const [indexRef, setIndexRef] = React.useState<AppViewRefDictionary>({})
  const { activePane } = orbitStore

  if (!activePane) {
    return null
  }

  const app = apps[activePane.type]
  const hasIndex = !!app.index
  const hasIndexContent = !indexRef[activePane.id] || indexRef[activePane.id].hasView === true
  const hasMain = !!app.main

  let sidebarWidth = 0
  if (hasIndex && hasIndexContent) {
    if (hasMain) {
      sidebarWidth = Math.min(450, Math.max(240, window.innerWidth / 3))
    } else {
      sidebarWidth = window.innerWidth
    }
  }

  return (
    <Sidebar width={sidebarWidth} minWidth={100} maxWidth={500}>
      <OrbitIndexView>
        <BorderTop />
        {paneManagerStore.panes.map(pane => {
          return (
            <SidebarSubPane
              key={pane.id}
              hasMain={hasMain}
              setIndexRef={setIndexRef}
              indexRef={indexRef}
              pane={pane}
            />
          )
        })}
      </OrbitIndexView>
    </Sidebar>
  )
})

export function useHasToolbar(paneId: string) {
  const { toolbarStore } = React.useContext(OrbitToolBarContext)
  return toolbarStore && !!toolbarStore.bars[paneId]
}

const SidebarSubPane = React.memo(function SidebarSubPane(props: {
  pane: Pane
  setIndexRef: Function
  indexRef: AppViewRefDictionary
  hasMain: boolean
}) {
  const { orbitStore } = useStoresSafe()
  const { pane, indexRef, setIndexRef, hasMain } = props
  const hasBars = useHasToolbar(pane.id)

  return (
    <SubPane id={pane.id} type={AppType[pane.type]} fullHeight padding={!hasMain ? [25, 80] : 0}>
      <ProvideSelectableHandlers onSelectItem={orbitStore.handleSelectItem}>
        <AppView
          ref={state => {
            if (isEqual(state, indexRef[pane.id])) return
            setIndexRef({ ...indexRef, [pane.id]: state })
          }}
          viewType="index"
          id={pane.id}
          type={pane.type}
          onAppStore={orbitStore.setAppStore(pane.id)}
          appConfig={{}}
          before={hasBars && <OrbitControlsHeight />}
        />
      </ProvideSelectableHandlers>
    </SubPane>
  )
})

const OrbitIndexView = gloss(View, {
  flex: 1,
  position: 'relative',
})
