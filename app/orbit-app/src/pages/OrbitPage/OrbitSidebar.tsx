import { gloss } from '@mcro/gloss'
import { AppType } from '@mcro/models'
import { Sidebar, View } from '@mcro/ui'
import { isEqual } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { apps } from '../../apps/apps'
import { AppView, AppViewRef } from '../../apps/AppView'
import { SubPane } from '../../components/SubPane'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { BorderTop } from '../../views/Border'
import { ProvideSelectableHandlers } from '../../views/Lists/SelectableList'

export default observer(function OrbitSidebar() {
  const { orbitStore, paneManagerStore } = useStoresSafe()
  const [indexRef, setIndexRef] = React.useState<{ [key: string]: AppViewRef }>({})
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
            <SubPane
              key={pane.id}
              id={pane.id}
              type={AppType[pane.type]}
              fullHeight
              padding={!hasMain ? [25, 80] : 0}
            >
              <ProvideSelectableHandlers onSelectItem={orbitStore.handleSelectItem}>
                <AppView
                  ref={state => {
                    if (!state || isEqual(state, indexRef[pane.id])) return
                    console.log('set', state)
                    setIndexRef({ ...indexRef, [pane.id]: state })
                  }}
                  viewType="index"
                  id={pane.id}
                  type={pane.type}
                  onAppStore={orbitStore.setAppStore(pane.id)}
                  appConfig={{}}
                />
              </ProvideSelectableHandlers>
            </SubPane>
          )
        })}
      </OrbitIndexView>
    </Sidebar>
  )
})

const OrbitIndexView = gloss(View, {
  flex: 1,
  position: 'relative',
})
