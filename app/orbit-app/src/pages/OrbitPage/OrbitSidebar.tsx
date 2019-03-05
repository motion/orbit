import { AppLoadContext, AppSubViewProps, ProvideSelectionContext, SubPane } from '@mcro/kit'
import { Sidebar } from '@mcro/ui'
import React, { memo, useContext, useEffect, useState } from 'react'
import { useStores } from '../../hooks/useStores'
import { statusbarPadElement } from './OrbitStatusBar'
import { toolbarPadElement } from './OrbitToolBar'

export const defaultSidebarWidth = Math.min(450, Math.max(240, window.innerWidth / 3))

export const OrbitSidebar = memo((props: AppSubViewProps) => {
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
      <Sidebar
        background="transparent"
        width={width}
        onResize={setWidth}
        minWidth={100}
        maxWidth={500}
        noBorder
      >
        {props.hasToolbar && toolbarPadElement}
        <ProvideSelectionContext onSelectItem={orbitStore.setSelectItem}>
          {props.children}
        </ProvideSelectionContext>
        {props.hasStatusbar && statusbarPadElement}
      </Sidebar>
    </SubPane>
  )
})
