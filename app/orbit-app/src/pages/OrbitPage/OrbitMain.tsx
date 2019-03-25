import { gloss } from '@o/gloss'
import { AppMainViewProps, AppLoadContext, SubPane } from '@o/kit'
import { BorderLeft } from '@o/ui'
import React, { memo, useContext } from 'react'
import { useStores } from '../../hooks/useStores'
import { statusbarPadElement } from './OrbitStatusBar'
import { ToolBarPad } from './OrbitToolBar'

export const OrbitMain = memo((props: AppMainViewProps) => {
  const { id, appDef } = useContext(AppLoadContext)
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
        transparent={appDef.config && appDef.config.transparentBackground}
      >
        {props.hasSidebar && <BorderLeft opacity={0.5} />}
        <ToolBarPad hasToolbar={props.hasToolbar} />
        {React.cloneElement(props.children, appProps)}
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
