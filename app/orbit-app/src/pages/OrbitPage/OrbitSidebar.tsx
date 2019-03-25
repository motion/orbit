import { View } from '@o/gloss'
import {
  AppMainViewProps,
  ListPropsContext,
  ProvideSelectionContext,
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
        <ToolBarPad hasToolbar={props.hasToolbar} />
        <View flex={1} position="relative" overflow="hidden">
          {props.hasToolbar && <BorderTop opacity={0.5} />}
          <ListPropsContext.Provider value={{ searchable: true, minSelected: 0 }}>
            <ProvideSelectionContext onSelectItem={orbitStore.setSelectItem}>
              {props.children}
            </ProvideSelectionContext>
          </ListPropsContext.Provider>
        </View>
        {props.hasStatusbar && statusbarPadElement}
      </Sidebar>
    </SubPane>
  )
})
