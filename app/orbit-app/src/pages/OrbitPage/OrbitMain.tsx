import { gloss } from '@o/gloss'
import { AppLoadContext, AppMainViewProps, SubPane } from '@o/kit'
import { isEditing } from '@o/stores'
import { BorderLeft, BorderTop, Loading, View } from '@o/ui'
import React, { memo, Suspense, useContext } from 'react'

import { useStores } from '../../hooks/useStores'
import { statusbarPadElement } from './OrbitStatusBar'
import { ToolBarPad } from './OrbitToolBar'

export const OrbitMain = memo((props: AppMainViewProps) => {
  const { id, appDef } = useContext(AppLoadContext)
  const { appStore } = useStores()
  const sidebarWidth = props.hasSidebar ? appStore.sidebarWidth : 0

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
          {props.hasSidebar && <BorderLeft opacity={0.5} />}
          {props.hasToolbar && <BorderTop opacity={0.5} />}
          <Suspense fallback={<Loading />}>{props.children}</Suspense>
        </View>
        <Suspense fallback={null}>{props.hasStatusbar && statusbarPadElement}</Suspense>
      </OrbitMainContainer>
    </SubPane>
  )
})

const OrbitMainContainer = gloss<{ isEditing: boolean; transparent?: boolean }>({
  flex: 1,
  overflowY: 'auto',
}).theme((props, theme) => ({
  background: props.transparent
    ? 'transparent'
    : props.isEditing
    ? theme.mainBackground || theme.background
    : theme.mainBackground || theme.background || 'transparent',
}))
