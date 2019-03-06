import { View } from '@mcro/gloss'
import { AppLoadContext, AppSubViewProps, ProvideSelectionContext, SubPane } from '@mcro/kit'
import { BorderTop, Sidebar } from '@mcro/ui'
import { useReaction } from '@mcro/use-store'
import React, { memo, useContext, useEffect } from 'react'
import { useStoresSimple } from '../../hooks/useStores'
import { statusbarPadElement } from './OrbitStatusBar'
import { toolbarPadElement } from './OrbitToolBar'

export const OrbitSidebar = memo((props: AppSubViewProps) => {
  const { identifier, id } = useContext(AppLoadContext)
  const { orbitStore, appStore } = useStoresSimple()
  const width = useReaction(() => appStore.sidebarWidth)

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
        width={width}
        onResize={appStore.setSidebarWidth}
        minWidth={100}
        maxWidth={500}
        noBorder
      >
        {props.hasToolbar && toolbarPadElement}
        <View flex={1} position="relative">
          {props.hasToolbar && <BorderTop opacity={0.5} />}
          <ProvideSelectionContext onSelectItem={orbitStore.setSelectItem}>
            {props.children}
          </ProvideSelectionContext>
        </View>
        {props.hasStatusbar && statusbarPadElement}
      </Sidebar>
    </SubPane>
  )
})
