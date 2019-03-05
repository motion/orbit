import { gloss } from '@mcro/gloss'
import { AppLoadContext, AppView, SubPane } from '@mcro/kit'
import { BorderLeft } from '@mcro/ui'
import React, { memo, useContext } from 'react'
import { useStores } from '../../hooks/useStores'
import { defaultSidebarWidth } from './OrbitSidebar'

export const OrbitMain = memo(({ children }) => {
  const { id, identifier } = useContext(AppLoadContext)
  const { orbitStore } = useStores()
  const appConfig = orbitStore.activeConfig[id] || {}

  if (!children) {
    return null
  }

  return (
    <SubPane left={defaultSidebarWidth} id={id} fullHeight zIndex={10}>
      <OrbitMainContainer isTorn={orbitStore.isTorn}>
        <AppView
          key={JSON.stringify(appConfig)}
          id={id}
          identifier={identifier}
          viewType="main"
          appConfig={appConfig}
          inside={<BorderLeft opacity={0.5} />}
        />
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
