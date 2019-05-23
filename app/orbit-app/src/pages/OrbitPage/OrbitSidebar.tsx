import { AppLoadContext, AppMainViewProps, SubPane } from '@o/kit'
import { BorderTop, ListPassProps, Sidebar } from '@o/ui'
import { Col } from 'gloss'
import React, { memo, useContext, useEffect } from 'react'

import { useStores } from '../../hooks/useStores'
import { statusbarPadElement } from './OrbitStatusBar'
import { ToolBarPad } from './OrbitToolBar'

export const OrbitSidebar = memo((props: AppMainViewProps) => {
  const { identifier, id } = useContext(AppLoadContext)
  const { appStore } = useStores()

  useEffect(() => {
    return () => {
      console.log('shouldnt unmount', id, identifier)
    }
  }, [])

  if (!props.hasSidebar) {
    return null
  }

  return (
    <SubPane id={id} fullHeight>
      <Sidebar
        background="transparent"
        width={appStore.showSidebar ? appStore.sidebarWidth : 0}
        onResize={appStore.setSidebarWidth}
        minWidth={appStore.showSidebar ? 100 : 0}
        maxWidth={500}
        noBorder
      >
        <ToolBarPad hasToolbar={props.hasToolbar} hasSidebar />
        <Col flex={1} position="relative" overflow="hidden">
          {props.hasToolbar && <BorderTop />}
          <ListPassProps
            shareable
            selectable
            searchable
            alwaysSelected
            itemProps={{ iconBefore: true, iconSize: 26 }}
          >
            {props.children}
          </ListPassProps>
        </Col>
        {props.hasStatusbar && statusbarPadElement}
      </Sidebar>
    </SubPane>
  )
})
