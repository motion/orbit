import { deep } from '@mcro/black'
import { Sidebar } from '@mcro/ui'
import { useHook, useStore } from '@mcro/use-store'
import { isEqual } from 'lodash'
import React, { memo, useState } from 'react'
import { AppType } from '../../apps/AppTypes'
import { AppView, AppViewRef } from '../../apps/AppView'
import { SubPane } from '../../components/SubPane'
import { useStores, useStoresSimple } from '../../hooks/useStores'
import { BorderRight } from '../../views/Border'
import { ProvideSelectableHandlers } from '../../views/Lists/SelectableList'
import { OrbitStatusBarHeight } from './OrbitStatusBar'
import { OrbitToolBarHeight } from './OrbitToolBar'

class OrbitSidebarStore {
  stores = useHook(useStoresSimple)

  viewRefs: { [key: string]: AppViewRef } = deep({})

  get activeViewRef() {
    return this.viewRefs[this.stores.paneManagerStore.activePane.id]
  }

  get hasIndexContent() {
    return !this.activeViewRef || this.activeViewRef.hasView === true
  }
}

export default memo(function OrbitSidebar() {
  const { paneManagerStore, appsStore } = useStores()
  const { hasMain, hasIndex } = appsStore.currentView
  const { activePane } = paneManagerStore
  const sidebarStore = useStore(OrbitSidebarStore)
  const defaultWidth = Math.min(450, Math.max(240, window.innerWidth / 3))
  const [sidebarWidth, setSidebarWidth] = useState(defaultWidth)

  if (!activePane) {
    return null
  }

  const actualWidth = (() => {
    let next = 0
    if (hasIndex && sidebarStore.hasIndexContent) {
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
            sidebarStore={sidebarStore}
            id={pane.id}
            type={pane.type}
          />
        )
      })}
    </Sidebar>
  )
})

const SidebarSubPane = memo(function SidebarSubPane(props: {
  id: string
  type: string
  sidebarStore: OrbitSidebarStore
  hasMain: boolean
}) {
  const { orbitStore } = useStores()
  const { id, type, sidebarStore, hasMain } = props

  const handleAppRef = state => {
    if (isEqual(state, sidebarStore.viewRefs[id])) return
    sidebarStore.viewRefs[id] = state
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
