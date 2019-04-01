import { gloss, View } from '@o/gloss'
import { AppLoadContext, AppMainViewProps, SubPane, useAppDefinitions, useStoreDebug } from '@o/kit'
import { BorderLeft, BorderTop } from '@o/ui'
import React, { cloneElement, isValidElement, memo, useContext } from 'react'
import { useStores } from '../../hooks/useStores'
import { statusbarPadElement } from './OrbitStatusBar'
import { ToolBarPad } from './OrbitToolBar'

export const OrbitMain = memo((props: AppMainViewProps) => {
  const { id, identifier } = useContext(AppLoadContext)
  const definition = useAppDefinitions().find(x => x.id === identifier)
  const { orbitStore, appStore } = useStores()
  const sidebarWidth = props.hasSidebar ? appStore.sidebarWidth : 0
  const appProps = orbitStore.activeConfig[id] || {}

  useStoreDebug()

  console.log('got', appProps)

  if (!props.children) {
    return null
  }

  return (
    <SubPane left={sidebarWidth} id={id} fullHeight zIndex={10}>
      <ToolBarPad hasToolbar={props.hasToolbar} hasSidebar={props.hasSidebar} />
      <OrbitMainContainer
        isTorn={orbitStore.isTorn}
        transparent={definition.config && definition.config.transparentBackground}
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

const OrbitMainContainer = gloss<{ isTorn: boolean; transparent?: boolean }>({
  flex: 1,
  overflowY: 'auto',
}).theme(({ isTorn, transparent }, theme) => ({
  background: transparent
    ? 'transparent'
    : isTorn
    ? theme.mainBackground || theme.background
    : theme.mainBackground || theme.background || 'transparent',
}))
