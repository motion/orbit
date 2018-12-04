import * as React from 'react'
import { view, StoreContext } from '@mcro/black'
import { OrbitPaneManager } from './OrbitPaneManager'
import { useInstantiatedStore } from '@mcro/use-store'
import { AppView } from '../../apps/AppView'

export const OrbitMainContent = React.memo(() => {
  const { paneManagerStore } = React.useContext(StoreContext)
  const { activePane } = useInstantiatedStore(paneManagerStore)
  if (!activePane) {
    return null
  }
  return (
    <>
      <OrbitIndexView isHidden={activePane === 'home'}>
        <OrbitPaneManager />
      </OrbitIndexView>
      <OrbitMainView>
        <AppView type={activePane} viewType="main" id="0" isActive title="ok" />
      </OrbitMainView>
    </>
  )
})

const OrbitIndexView = view({
  width: 300,
  isHidden: {
    display: 'none',
  },
}).theme(({ theme }) => ({
  borderRight: [1, theme.borderColor.alpha(0.5)],
}))

const OrbitMainView = view({
  flex: 1,
  position: 'relative',
})
