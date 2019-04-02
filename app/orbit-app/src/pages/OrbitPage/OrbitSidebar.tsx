import { View } from '@o/gloss'
import {
  AppMainViewProps,
  ListPropsContext,
  PassExtraListProps,
  SubPane,
  AppLoadContext
} from '@o/kit'
import { BorderTop, Sidebar } from '@o/ui'
import React, { memo, useContext, useEffect } from 'react'
import { useStores } from '../../hooks/useStores'
import { statusbarPadElement } from './OrbitStatusBar'
import { ToolBarPad } from './OrbitToolBar'

export const OrbitSidebar = memo((props: AppMainViewProps) => {
  const { identifier, id } = useContext(AppLoadContext)
  const { orbitStore, appStore } = useStores()

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
        <View flex={1} position="relative" overflow="hidden">
          {props.hasToolbar && <BorderTop opacity={0.5} />}
          <ListPropsContext.Provider
            value={{ selectable: true, searchable: true, alwaysSelected: true }}
          >
            <PassExtraListProps
              onSelectItem={(index, appProps) => orbitStore.setSelectItem(id, index, appProps)}
            >
              {props.children}
            </PassExtraListProps>
          </ListPropsContext.Provider>
        </View>
        {props.hasStatusbar && statusbarPadElement}
      </Sidebar>
    </SubPane>
  )
})
