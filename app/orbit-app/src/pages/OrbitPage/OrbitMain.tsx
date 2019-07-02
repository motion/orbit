import { AppLoadContext, AppMainViewProps, useReaction, useStore } from '@o/kit'
import { App } from '@o/stores'
import { BorderLeft, BorderTop, Col, Loading, SuspenseWithBanner, useShareStore, View } from '@o/ui'
import { Box, gloss } from 'gloss'
import React, { memo, Suspense, useContext, useRef } from 'react'

import { useStores } from '../../hooks/useStores'
import { statusbarPadElement } from './OrbitStatusBar'
import { ToolBarPad } from './OrbitToolBar'

export const OrbitMain = memo((props: AppMainViewProps) => {
  const { id, appDef } = useContext(AppLoadContext)
  const { appStore } = useStores()
  const shareStore = useShareStore()
  const sidebarWidth = props.hasSidebar ? appStore.sidebarWidth : 0
  const { isEditing } = useStore(App)
  const suspenseBanner = useRef<SuspenseWithBanner>()

  useReaction(
    () => shareStore.clipboards['main'],
    () => {
      suspenseBanner.current.clearError()
    },
    {
      lazy: true,
    },
  )

  if (!props.children) {
    return null
  }

  return (
    <Col left={sidebarWidth} id={id} flex={1} zIndex={10}>
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
          <SuspenseWithBanner ref={suspenseBanner} fallback={<Loading />}>
            {props.children}
          </SuspenseWithBanner>
        </View>
        <Suspense fallback={null}>{props.hasStatusbar && statusbarPadElement}</Suspense>
      </OrbitMainContainer>
    </Col>
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
