import { Absolute, gloss } from '@mcro/gloss'
import { ProvideSelectionContext, SubPane } from '@mcro/kit'
import { Sidebar } from '@mcro/ui'
import React, { memo, useEffect, useState } from 'react'
import { useStores } from '../../hooks/useStores'
import { OrbitToolBarHeight } from './OrbitToolBar'

export const defaultSidebarWidth = Math.min(450, Math.max(240, window.innerWidth / 3))

const SidebarContainer = gloss(Absolute, {
  top: 0,
  left: 0,
  bottom: 0,
  overflow: 'hidden',
  position: 'relative',
  hideSidebar: {
    zIndex: -1,
    pointerEvents: 'none',
    opacity: 0,
  },
})

export const OrbitSidebar = memo((props: { id: string; identifier: string; children: any }) => {
  const { orbitStore, appsStore } = useStores()
  const { id, identifier } = props
  const { hasMain, hasIndex } = appsStore.getViewState(identifier)
  const hideSidebar = !hasIndex && true
  const [width, setWidth] = useState(defaultSidebarWidth)

  useEffect(() => {
    return () => {
      console.log('shouldnt unmount', id, props.id)
    }
  }, [])

  return (
    <SubPane id={id} fullHeight padding={!hasMain ? [25, 80] : 0}>
      <SidebarContainer hideSidebar={hideSidebar} width={width}>
        <Sidebar
          background="transparent"
          width={width}
          onResize={setWidth}
          minWidth={100}
          maxWidth={500}
          noBorder
        >
          <ProvideSelectionContext onSelectItem={orbitStore.setSelectItem}>
            <OrbitToolBarHeight identifier={identifier} />
            {props.children}
          </ProvideSelectionContext>
        </Sidebar>
      </SidebarContainer>
    </SubPane>
  )
})
