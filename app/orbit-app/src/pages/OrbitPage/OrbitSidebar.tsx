import { AppLoadContext, AppMainViewProps } from '@o/kit'
import { BorderTop, ListPassProps, Sidebar, View } from '@o/ui'
import React, { memo, useContext, useEffect } from 'react'

import { useStores } from '../../hooks/useStores'
import { statusbarPadElement } from './OrbitStatusBar'
import { ToolBarPad } from './OrbitToolBar'

export const OrbitSidebar = memo((props: AppMainViewProps) => {
  const { id, identifier } = useContext(AppLoadContext)
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
    <Sidebar
      background="transparent"
      width={appStore.showSidebar ? appStore.sidebarWidth : 0}
      onResize={appStore.setSidebarWidth}
      minWidth={appStore.showSidebar ? 200 : 0}
      maxWidth={500}
      noBorder
    >
      <ToolBarPad hasToolbar={props.hasToolbar} hasSidebar />
      <View flex={1} position="relative" overflow="hidden">
        {props.hasToolbar && <BorderTop />}
        <ListPassProps
          shareable
          selectable
          searchable
          itemProps={{ iconBefore: true, iconSize: 26 }}
          titleScale={0.75}
        >
          {props.children}
        </ListPassProps>
      </View>
      {props.hasStatusbar && statusbarPadElement}
    </Sidebar>
  )
})
