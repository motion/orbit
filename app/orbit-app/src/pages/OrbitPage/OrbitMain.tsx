import { gloss, View } from '@o/gloss'
import { AppLoadContext, AppMainViewProps, SubPane, useReaction } from '@o/kit'
import { isEditing } from '@o/stores'
import { BorderLeft, BorderTop } from '@o/ui'
import React, { cloneElement, isValidElement, memo, useContext } from 'react'
import { useStores, useStoresSimple } from '../../hooks/useStores'
import { statusbarPadElement } from './OrbitStatusBar'
import { ToolBarPad } from './OrbitToolBar'

export const OrbitMain = memo((props: AppMainViewProps) => {
  const { id, appDef, identifier } = useContext(AppLoadContext)
  const { orbitStore } = useStoresSimple()
  const { appStore } = useStores()
  const sidebarWidth = props.hasSidebar ? appStore.sidebarWidth : 0
  const appProps = useReaction(() => orbitStore.activeConfig[id] || {})

  if (!props.children) {
    return null
  }

  return (
    <SubPane left={sidebarWidth} id={id} fullHeight zIndex={10}>
      <ToolBarPad hasToolbar={props.hasToolbar} hasSidebar={props.hasSidebar} />
      <OrbitMainContainer
        isEditing={isEditing}
        transparent={appDef.config && appDef.config.transparentBackground}
      >
        <View flex={1} position="relative">
          {props.hasSidebar && <BorderLeft opacity={0.5} />}
          {props.hasToolbar && <BorderTop opacity={0.5} />}
          {isValidElement(props.children) ? cloneElement(props.children, appProps) : props.children}
        </View>
        {props.hasStatusbar && statusbarPadElement}
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
