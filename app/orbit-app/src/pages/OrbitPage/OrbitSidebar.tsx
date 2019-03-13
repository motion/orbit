import { View } from '@o/gloss'
import { AppLoadContext, AppMainViewProps, ListPropsContext, ProvideSelectionContext, SubPane } from '@o/kit'
import { BorderTop, Sidebar } from '@o/ui'
import React, { memo, useContext, useEffect } from 'react'
import { useStores } from '../../hooks/useStores'
import { statusbarPadElement } from './OrbitStatusBar'
import { toolbarPadElement } from './OrbitToolBar'

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
        width={appStore.sidebarWidth}
        onResize={appStore.setSidebarWidth}
        minWidth={100}
        maxWidth={500}
        noBorder
      >
        {props.hasToolbar && toolbarPadElement}
        <View flex={1} position="relative">
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
