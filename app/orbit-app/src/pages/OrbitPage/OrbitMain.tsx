import { gloss } from '@mcro/gloss'
import { AppLoadContext, AppSubViewProps, SubPane } from '@mcro/kit'
import { BorderLeft } from '@mcro/ui'
import { useStoreDebug } from '@mcro/use-store'
import React, { memo, useContext } from 'react'
import { useStores } from '../../hooks/useStores'
import { defaultSidebarWidth } from './OrbitSidebar'
import { statusbarPadElement } from './OrbitStatusBar'
import { toolbarPadElement } from './OrbitToolBar'

export const OrbitMain = memo((props: AppSubViewProps) => {
  useStoreDebug()
  const { id } = useContext(AppLoadContext)
  const { orbitStore } = useStores()
  const appConfig = orbitStore.activeConfig[id] || {}

  console.log('now its', appConfig)

  if (!props.children) {
    return null
  }

  return (
    <SubPane left={props.hasSidebar ? defaultSidebarWidth : 0} id={id} fullHeight zIndex={10}>
      <OrbitMainContainer isTorn={orbitStore.isTorn}>
        <BorderLeft opacity={0.5} />
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
