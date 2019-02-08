import { Sidebar } from '@mcro/ui'
import { isEqual } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { apps } from '../../apps/apps'
import { AppType } from '../../apps/AppTypes'
import { AppView, AppViewRef } from '../../apps/AppView'
import { SubPane } from '../../components/SubPane'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Pane } from '../../stores/PaneManagerStore'
import { BorderRight } from '../../views/Border'
import { ProvideSelectableHandlers } from '../../views/Lists/SelectableList'
import { OrbitStatusBarHeight } from './OrbitStatusBar'
import { OrbitToolBarHeight } from './OrbitToolBar'

type AppViewRefDictionary = { [key: string]: AppViewRef }

// needs to be in observer for now, we can refactor later
export function useInspectViews() {
  const { appsStore, paneManagerStore } = useStoresSafe()
  const { activePane } = paneManagerStore

  let hasIndex = false
  let hasMain = false

  const views = appsStore.appViews[activePane.id]
  if (views) {
    // dynamic app view
    hasMain = !!views.main
    hasIndex = !!views.index
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
  const { paneManagerStore } = useStoresSafe()
  const { activePane } = paneManagerStore
  const [indexRef, setIndexRef] = React.useState<AppViewRefDictionary>({})
  const defaultWidth = Math.min(450, Math.max(240, window.innerWidth / 3))
  const [sidebarWidth, setSidebarWidth] = React.useState(defaultWidth)
  const { hasMain, hasIndex } = useInspectViews()

  console.log({ hasMain, hasIndex })

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
    <Sidebar
      background="transparent"
      width={actualWidth}
      onResize={handleResize}
      minWidth={100}
      maxWidth={500}
      noBorder
    >
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
    </Sidebar>
  )
})

const SidebarSubPane = React.memo(function SidebarSubPane(props: {
  pane: Pane
  setIndexRef: Function
  indexRef: AppViewRefDictionary
  hasMain: boolean
}) {
  const { orbitStore } = useStoresSafe()
  const { pane, indexRef, setIndexRef, hasMain } = props

  return (
    <SubPane id={pane.id} type={AppType[pane.type]} fullHeight padding={!hasMain ? [25, 80] : 0}>
      <ProvideSelectableHandlers onSelectItem={orbitStore.handleSelectItem}>
        <BorderRight opacity={0.5} />
        <AppView
          key={pane.id}
          ref={state => {
            if (isEqual(state, indexRef[pane.id])) return
            setIndexRef({ ...indexRef, [pane.id]: state })
          }}
          viewType="index"
          id={pane.id}
          type={pane.type}
          appConfig={{}}
          before={<OrbitToolBarHeight id={props.pane.id} />}
          after={<OrbitStatusBarHeight id={props.pane.id} />}
        />
      </ProvideSelectableHandlers>
    </SubPane>
  )
})
