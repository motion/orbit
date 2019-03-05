import { gloss } from '@mcro/gloss'
import { AppLoadContext, AppSubViewProps, SubPane } from '@mcro/kit'
import { BorderLeft } from '@mcro/ui'
import { useReaction } from '@mcro/use-store'
import React, { memo, useContext } from 'react'
import { useStoresSimple } from '../../hooks/useStores'
import { statusbarPadElement } from './OrbitStatusBar'
import { toolbarPadElement } from './OrbitToolBar'

export const OrbitMain = memo((props: AppSubViewProps) => {
  const { id } = useContext(AppLoadContext)
  const { orbitStore, appStore } = useStoresSimple()
  const sidebarWidth = useReaction(() => {
    return props.hasSidebar ? appStore.sidebarWidth : 0
  })
  const appConfig = useReaction(() => {
    return orbitStore.activeConfig[id] || {}
  })

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
