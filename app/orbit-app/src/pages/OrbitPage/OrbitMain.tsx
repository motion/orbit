import { gloss } from '@o/gloss'
import { AppLoadContext, AppMainViewProps, SubPane, useAppDefinitions } from '@o/kit'
import { BorderLeft } from '@o/ui'
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

  if (!props.children) {
    return null
  }

  return (
    <SubPane left={sidebarWidth} id={id} fullHeight zIndex={10}>
      <OrbitMainContainer
        isTorn={orbitStore.isTorn}
        transparent={definition.config && definition.config.transparentBackground}
      >
        {props.hasSidebar && <BorderLeft opacity={0.5} />}
        <ToolBarPad hasToolbar={props.hasToolbar} />
        {isValidElement(props.children) ? cloneElement(props.children, appProps) : props.children}
        {props.hasStatusbar && statusbarPadElement}
      </OrbitMainContainer>
    </SubPane>
  )
})

const OrbitMainContainer = gloss<{ isTorn: boolean; transparent?: boolean }>({
  flex: 1,
}).theme(({ isTorn, transparent }, theme) => ({
  background: transparent
    ? 'transparent'
    : isTorn
    ? theme.mainBackground || theme.background
    : theme.mainBackground || theme.background || 'transparent',
}))
