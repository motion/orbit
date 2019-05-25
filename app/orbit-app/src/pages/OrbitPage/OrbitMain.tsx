import { AppLoadContext, AppMainViewProps, SubPane, useStore } from '@o/kit'
import { App } from '@o/stores'
import { BorderLeft, BorderTop, Loading, View } from '@o/ui'
import { Box, gloss } from 'gloss'
import React, { memo, Suspense, useContext } from 'react'

import { useStores } from '../../hooks/useStores'
import { statusbarPadElement } from './OrbitStatusBar'
import { ToolBarPad } from './OrbitToolBar'

export const OrbitMain = memo((props: AppMainViewProps) => {
  const { id, appDef } = useContext(AppLoadContext)
  const { appStore } = useStores()
  const sidebarWidth = props.hasSidebar ? appStore.sidebarWidth : 0
  const { isEditing } = useStore(App)

  if (!props.children) {
    return null
  }

  return (
    <SubPane left={sidebarWidth} id={id} fullHeight zIndex={10}>
      <Suspense fallback={null}>
        <ToolBarPad hasToolbar={props.hasToolbar} hasSidebar={props.hasSidebar} />
      </Suspense>
      <OrbitMainContainer
        isEditing={isEditing}
        transparent={appDef.viewConfig && appDef.viewConfig.transparentBackground}
      >
        <View className="app-container" flex={1} position="relative" maxHeight="100%">
          {props.hasSidebar && <BorderLeft />}
          {props.hasToolbar && <BorderTop />}
          <Suspense fallback={<Loading />}>{props.children}</Suspense>
        </View>
        <Suspense fallback={null}>{props.hasStatusbar && statusbarPadElement}</Suspense>
      </OrbitMainContainer>
    </SubPane>
  )
})

const OrbitMainContainer = gloss<{ isEditing: boolean; transparent?: boolean }>(Box, {
  flex: 1,
  overflowY: 'auto',
}).theme((props, theme) => ({
  background: props.transparent
    ? 'transparent'
    : props.isEditing
    ? theme.mainBackground || theme.background
    : theme.mainBackground || theme.background || 'transparent',
}))
