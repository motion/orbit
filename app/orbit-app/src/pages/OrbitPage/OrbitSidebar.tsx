import { deep } from '@mcro/black'
import { Absolute, gloss } from '@mcro/gloss'
import { AppView, AppViewRef, ProvideSelectionContext, SubPane } from '@mcro/kit'
import { BorderRight, Sidebar } from '@mcro/ui'
import { useHook } from '@mcro/use-store'
import { isEqual } from 'lodash'
import React, { memo, useEffect, useMemo } from 'react'
import { useStores, useStoresSimple } from '../../hooks/useStores'
import { OrbitStatusBarHeight } from './OrbitStatusBar'
import { OrbitToolBarHeight } from './OrbitToolBar'

export const defaultSidebarWidth = Math.min(450, Math.max(240, window.innerWidth / 3))

export class SidebarStore {
  stores = useHook(useStoresSimple)
  width = defaultSidebarWidth

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
  const { type } = paneManagerStore.activePane
  const { hasMain, hasIndex } = appsStore.getViewState(type)
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
                appId={pane.type}
              />
            )
          })}
        </>
      )
    },
    [paneManagerStore.panes, hasMain],
  )

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
  appId: string
  sidebarStore: SidebarStore
  hasMain: boolean
}) {
  const { orbitStore } = useStores()
  const { id, appId, sidebarStore, hasMain } = props

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
      <ProvideSelectionContext onSelectItem={orbitStore.setSelectItem}>
        <AppView
          key={id}
          id={id}
          identifier={appId}
          viewType="index"
          ref={handleAppRef}
          before={<OrbitToolBarHeight appId={appId} />}
          after={<OrbitStatusBarHeight appId={appId} />}
          inside={<BorderRight />}
        />
      </ProvideSelectionContext>
    </SubPane>
  )
})
