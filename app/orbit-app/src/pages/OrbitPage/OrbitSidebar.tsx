import { deep } from '@mcro/black'
import { Absolute, gloss } from '@mcro/gloss'
import { Sidebar } from '@mcro/ui'
import { useHook } from '@mcro/use-store'
import { isEqual } from 'lodash'
import React, { memo, useEffect, useMemo } from 'react'
import { AppView, AppViewRef } from '../../apps/AppView'
import { SubPane } from '../../components/SubPane'
import { useStores, useStoresSimple } from '../../hooks/useStores'
import { BorderRight } from '../../views/Border'
import { ProvideSelectableHandlers } from '../../views/Lists/SelectableList'
import { OrbitStatusBarHeight } from './OrbitStatusBar'
import { OrbitToolBarHeight } from './OrbitToolBar'

export class SidebarStore {
  stores = useHook(useStoresSimple)
  width = Math.min(450, Math.max(240, window.innerWidth / 3))

  indexViews: { [key: string]: AppViewRef } = deep({})

  handleResize = next => {
    this.width = next
  }

  get activePane() {
    return this.stores.paneManagerStore.activePaneLowPriority
  }

  get indexView() {
    return this.indexViews[this.activePane.id]
  }

  get hasIndexContent() {
    return this.indexView && this.indexView.hasView === true
  }
}

export default memo(function OrbitSidebar() {
  const { paneManagerStore, appsStore, sidebarStore } = useStores()
  const { hasMain, hasIndex } = appsStore.currentView || {
    hasMain: false,
    hasIndex: false,
  }
  const hideSidebar = !hasIndex && !sidebarStore.hasIndexContent
  const width = sidebarStore.width

  const elements = useMemo(
    () => {
      return (
        <>
          {paneManagerStore.panes.map(pane => {
            return (
              <SidebarSubPane
                key={pane.id}
                hasMain={hasMain}
                sidebarStore={sidebarStore}
                id={pane.id}
                type={pane.type}
              />
            )
          })}
        </>
      )
    },
    [paneManagerStore.panes, hasMain],
  )

  if (!appsStore.currentView) {
    return null
  }

  return (
    <SidebarContainer hideSidebar={hideSidebar} width={width}>
      <Sidebar
        background="transparent"
        width={width}
        onResize={sidebarStore.handleResize}
        minWidth={100}
        maxWidth={500}
        noBorder
      >
        {elements}
      </Sidebar>
    </SidebarContainer>
  )
})

const SidebarContainer = gloss(Absolute, {
  top: 0,
  left: 0,
  bottom: 0,
  zIndex: 10000000,
  overflow: 'hidden',
  position: 'relative',
  hideSidebar: {
    zIndex: -1,
    pointerEvents: 'none',
    opacity: 0,
  },
})

const SidebarSubPane = memo(function SidebarSubPane(props: {
  id: string
  type: string
  sidebarStore: SidebarStore
  hasMain: boolean
}) {
  const { orbitStore } = useStores()
  const { id, type, sidebarStore, hasMain } = props

  const handleAppRef = state => {
    if (isEqual(state, sidebarStore.indexViews[id])) return
    sidebarStore.indexViews[id] = state
  }

  useEffect(() => {
    return () => {
      console.log('shouldnt unmount', id, props.id)
    }
  }, [])

  return (
    <SubPane id={id} fullHeight padding={!hasMain ? [25, 80] : 0}>
      <ProvideSelectableHandlers onSelectItem={orbitStore.handleSelectItem}>
        <AppView
          key={id}
          ref={handleAppRef}
          viewType="index"
          id={id}
          type={type}
          before={<OrbitToolBarHeight id={id} />}
          after={<OrbitStatusBarHeight id={id} />}
          inside={<BorderRight />}
        />
      </ProvideSelectableHandlers>
    </SubPane>
  )
})
