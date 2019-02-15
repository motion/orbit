import { deep } from '@mcro/black'
import { Absolute, gloss } from '@mcro/gloss'
import { Sidebar } from '@mcro/ui'
import { useHook } from '@mcro/use-store'
import { isEqual } from 'lodash'
import React, { memo, useMemo } from 'react'
import { AppType } from '../../apps/AppTypes'
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

  get indexView() {
    return this.indexViews[this.stores.paneManagerStore.activePane.id]
  }

  get hasIndexContent() {
    return this.indexView && this.indexView.hasView === true
  }
}

export default memo(function OrbitSidebar() {
  const { paneManagerStore, appsStore, sidebarStore } = useStores()
  const { activePane } = paneManagerStore
  const { hasMain, hasIndex } = appsStore.currentView || {
    hasMain: false,
    hasIndex: false,
  }
  const hideSidebar = !hasIndex && !sidebarStore.hasIndexContent

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

  if (!appsStore.currentView || !activePane) {
    return null
  }

  return (
    <SidebarContainer hideSidebar={hideSidebar} width={sidebarStore.width}>
      <Sidebar
        background="transparent"
        width={sidebarStore.width}
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

  return (
    <SubPane id={id} type={AppType[type]} fullHeight padding={!hasMain ? [25, 80] : 0}>
      <ProvideSelectableHandlers onSelectItem={orbitStore.handleSelectItem}>
        <BorderRight opacity={0.5} />
        <AppView
          key={id}
          ref={handleAppRef}
          viewType="index"
          id={id}
          type={type}
          before={<OrbitToolBarHeight id={id} />}
          after={<OrbitStatusBarHeight id={id} />}
        />
      </ProvideSelectableHandlers>
    </SubPane>
  )
})
