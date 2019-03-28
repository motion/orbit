import { AppLoadContext, AppStore, AppViewsContext, getAppDefinition, ProvideStores } from '@o/kit'
import { Button, Loading, Section, SelectionStore, useOnMount, Visibility } from '@o/ui'
import { useReaction, useStoreSimple } from '@o/use-store'
import React, { Component, memo, Suspense, useCallback } from 'react'
import '../../apps/orbitApps'
import { useAppLocationEffect } from '../../effects/useAppLocationEffect'
import { useStoresSimple } from '../../hooks/useStores'
import { OrbitMain } from './OrbitMain'
import { OrbitSidebar } from './OrbitSidebar'
import { OrbitStatusBar } from './OrbitStatusBar'
import { OrbitToolBar } from './OrbitToolBar'

export const OrbitApp = ({ id, identifier }: { id: string; identifier: string }) => {
  const { orbitStore, paneManagerStore } = useStoresSimple()
  const getIsActive = () => paneManagerStore.activePane && paneManagerStore.activePane.id === id
  const isActive = useReaction(getIsActive)
  const appStore = useStoreSimple(AppStore, {
    id,
    identifier,
    isActive: useCallback(getIsActive, []),
  })
  const selectionStore = useStoreSimple(SelectionStore, { isActive })

  // set default initial appProps
  useOnMount(function setInitialConfig() {
    orbitStore.setActiveConfig(id, {
      identifier,
    })
  })

  return (
    <ProvideStores stores={{ selectionStore, appStore }}>
      <Visibility visible={isActive}>
        <OrbitAppRender id={id} identifier={identifier} />
      </Visibility>
    </ProvideStores>
  )
}

const OrbitAppRender = memo(({ id, identifier }: { id: string; identifier: string }) => {
  // handle url changes
  useAppLocationEffect()

  const { app } = getAppDefinition(identifier)

  if (!app) {
    console.debug('no app', id, identifier)
    return null
  }

  const App = app
  const Toolbar = OrbitToolBar
  const Sidebar = OrbitSidebar
  const Main = OrbitMain
  const Statusbar = OrbitStatusBar

  return (
    <Suspense fallback={<Loading />}>
      <AppLoadContext.Provider value={{ id, identifier }}>
        <AppViewsContext.Provider value={{ Toolbar, Sidebar, Main, Statusbar }}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </AppViewsContext.Provider>
      </AppLoadContext.Provider>
    </Suspense>
  )
})

class ErrorBoundary extends Component {
  state = {
    error: null,
  }

  componentDidCatch(error) {
    console.error('erri s', error)
    this.setState({ error })
  }

  render() {
    if (this.state.error) {
      return (
        <Section
          background="red"
          color="white"
          title="Error"
          flex={1}
          minWidth={200}
          minHeight={200}
        >
          <pre>{JSON.stringify(this.state.error)}</pre>
          <Button onClick={() => this.setState({ error: null })}>Clear</Button>
        </Section>
      )
    }
    return this.props.children
  }
}

if (module['hot']) {
  module['hot'].accept()
}
