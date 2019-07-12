import { AppLoadContext, AppMainViewProps, useReaction, useStore } from '@o/kit'
import { App } from '@o/stores'
import { BorderLeft, BorderTop, Loading, SuspenseWithBanner, useShareStore, View } from '@o/ui'
import { Box, FullScreen, gloss } from 'gloss'
import React, { memo, Suspense, useContext, useRef } from 'react'

import { useStores } from '../../hooks/useStores'
import { statusbarPadElement } from './OrbitStatusBar'
import { ToolBarPad } from './OrbitToolBar'

export const OrbitMain = memo((props: AppMainViewProps) => {
  const { appDef } = useContext(AppLoadContext)
  const { appStore } = useStores()
  const shareStore = useShareStore()
  const sidebarWidth = props.hasSidebar ? appStore.sidebarWidth : 0
  const { isEditing } = useStore(App)
  const suspenseBanner = useRef<SuspenseWithBanner | null>(null)

  useReaction(
    () => shareStore.clipboards.main,
    () => {
      if (suspenseBanner.current) {
        suspenseBanner.current.clearError()
      }
    },
    {
      lazy: true,
    },
  )

  if (!props.children) {
    return null
  }

  if (!appDef) {
    return <div>No app def found</div>
  }

  const transparent = appDef.viewConfig && appDef.viewConfig.transparentBackground

  return (
    <FullScreen
      className="orbit-main"
      position="absolute"
      zIndex={10}
      style={{ left: sidebarWidth }}
    >
      <Suspense fallback={null}>
        <ToolBarPad hasToolbar={props.hasToolbar} hasSidebar={props.hasSidebar} />
      </Suspense>
      <OrbitMainContainer isEditing={isEditing} transparent={transparent}>
        <View className="app-container" flex={1} position="relative" maxHeight="100%">
          {props.hasSidebar && <BorderLeft />}
          {props.hasToolbar && <BorderTop />}
          <SuspenseWithBanner ref={suspenseBanner} fallback={<Loading />}>
            {props.children}
          </SuspenseWithBanner>
        </View>
        <Suspense fallback={null}>{props.hasStatusbar && statusbarPadElement}</Suspense>
      </OrbitMainContainer>
    </FullScreen>
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
