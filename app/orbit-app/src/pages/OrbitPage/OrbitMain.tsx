import { gloss } from '@o/gloss'
import { AppLoadContext, AppSubViewProps, SubPane } from '@o/kit'
import { BorderLeft } from '@o/ui'
import React, { memo, useContext } from 'react'
import { useStores } from '../../hooks/useStores'
import { statusbarPadElement } from './OrbitStatusBar'
import { toolbarPadElement } from './OrbitToolBar'

export const OrbitMain = memo((props: AppSubViewProps) => {
  const { id } = useContext(AppLoadContext)
  const { orbitStore, appStore } = useStores()
  const sidebarWidth = props.hasSidebar ? appStore.sidebarWidth : 0
  const appConfig = orbitStore.activeConfig[id] || {}

  if (!props.children) {
    return null
  }

  return (
    <SubPane left={sidebarWidth} id={id} fullHeight zIndex={10}>
      <OrbitMainContainer isTorn={orbitStore.isTorn}>
        {props.hasSidebar && <BorderLeft opacity={0.5} />}
        {props.hasToolbar && toolbarPadElement}
        {React.cloneElement(props.children, {
          appConfig,
        })}
        {props.hasStatusbar && statusbarPadElement}
      </OrbitMainContainer>
    </SubPane>
  )
})

const OrbitMainContainer = gloss<{ isTorn: boolean }>({
  flex: 1,
}).theme(({ isTorn }, theme) => ({
  background: isTorn
    ? theme.mainBackground || theme.background
    : theme.mainBackground || theme.background || 'transparent',
}))
