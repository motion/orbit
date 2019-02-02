import { gloss } from '@mcro/gloss'
import { AppType } from '@mcro/models'
import { Sidebar, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { apps } from '../../apps/apps'
import { AppView } from '../../apps/AppView'
import { SubPane } from '../../components/SubPane'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { BorderTop } from '../../views/Border'
import { ProvideSelectableHandlers } from '../../views/Lists/SelectableList'

export default observer(function OrbitSidebar() {
  const { orbitStore, paneManagerStore } = useStoresSafe()

  if (!orbitStore.activePane) {
    return null
  }

  const activeApp = apps[orbitStore.activePane.type]
  const hasIndex = !!activeApp.index
  const hasMain = !!activeApp.main

  return (
    <Sidebar
      width={hasIndex ? (hasMain ? 340 : window.innerWidth) : 0}
      minWidth={100}
      maxWidth={500}
    >
      <BorderTop />
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
  )
})

const OrbitIndexView = gloss(View, {
  flex: 1,
  position: 'relative',
})
