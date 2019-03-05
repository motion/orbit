import { Absolute, gloss } from '@mcro/gloss'
import { AppLoadContext, ProvideSelectionContext, SubPane } from '@mcro/kit'
import { Sidebar } from '@mcro/ui'
import React, { memo, useContext, useEffect, useState } from 'react'
import { useStores } from '../../hooks/useStores'

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

export const OrbitSidebar = memo((props: { children: any }) => {
  const { identifier, id } = useContext(AppLoadContext)
  const { orbitStore } = useStores()
  const [width, setWidth] = useState(defaultSidebarWidth)

  useEffect(() => {
    return () => {
      console.log('shouldnt unmount', id, identifier)
    }
  }, [])

  return (
    <SubPane id={id} fullHeight>
      <SidebarContainer hideSidebar={!props.children} width={width}>
        <Sidebar
          background="transparent"
          width={width}
          onResize={setWidth}
          minWidth={100}
          maxWidth={500}
          noBorder
        >
          <ProvideSelectionContext onSelectItem={orbitStore.setSelectItem}>
            {props.children}
          </ProvideSelectionContext>
        </Sidebar>
      </SidebarContainer>
    </SubPane>
  )
})
