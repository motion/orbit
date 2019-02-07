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

// needs to be in observer for now, we can refactor later
export function useInspectViews() {
  const { appsStore, paneManagerStore } = useStoresSafe()
  const { activePane } = paneManagerStore

  let hasIndex = false
  let hasMain = false

  if (activePane.subType === 'app') {
    // dynamic app view
    hasMain = !!appsStore.appViews[activePane.id].main
    hasIndex = !!appsStore.appViews[activePane.id].index
  } else {
    // static view we provide for alternate panes like settings/onboarding
    const app = apps[activePane.type]
    hasIndex = !!app['index']
    hasMain = !!app['main']
  }

  return {
    hasMain,
    hasIndex,
  }
}

export default observer(function OrbitSidebar() {
  const { orbitStore, paneManagerStore } = useStoresSafe()
  const [indexRef, setIndexRef] = React.useState<AppViewRefDictionary>({})
  const defaultWidth = Math.min(450, Math.max(240, window.innerWidth / 3))
  const [sidebarWidth, setSidebarWidth] = React.useState(defaultWidth)
  const { activePane } = orbitStore
  const { hasMain, hasIndex } = useInspectViews()

  if (!activePane) {
    return null
  }

  const hasIndexContent = !indexRef[activePane.id] || indexRef[activePane.id].hasView === true

  const actualWidth = (() => {
    let next = 0
    if (hasIndex && hasIndexContent) {
      if (hasMain) {
        next = sidebarWidth
      } else {
        next = window.innerWidth
      }
    }
    return next
  })()

  const handleResize = width => {
    console.log('set widht', width)
    setSidebarWidth(width)
  }

  return (
    <Sidebar width={actualWidth} onResize={handleResize} minWidth={100} maxWidth={500}>
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
