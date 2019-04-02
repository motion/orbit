import { AppDefinition, AppLoadContext, AppStore, AppViewsContext, getAppDefinition, ProvideStores } from '@o/kit';
import { Button, Loading, Section, Space, View, Visibility } from '@o/ui';
import { useReaction, useStoreSimple } from '@o/use-store';
import React, { Component, memo, Suspense, useCallback } from 'react';
import '../../apps/orbitApps';
import { useAppLocationEffect } from '../../effects/useAppLocationEffect';
import { useStoresSimple } from '../../hooks/useStores';
import { OrbitMain } from './OrbitMain';
import { OrbitSidebar } from './OrbitSidebar';
import { OrbitStatusBar } from './OrbitStatusBar';
import { OrbitToolBar } from './OrbitToolBar';

export const OrbitApp = ({ id, identifier }: { id: string; identifier: string }) => {
  const { paneManagerStore } = useStoresSimple()
  const getIsActive = () => paneManagerStore.activePane && paneManagerStore.activePane.id === id
  const isActive = useReaction(getIsActive)
  const appStore = useStoreSimple(AppStore, {
    id,
    identifier,
    isActive: useCallback(getIsActive, []),
  })

  return (
    <ProvideStores stores={{ appStore }}>
      <Visibility visible={isActive}>
        <OrbitAppRender id={id} identifier={identifier} />
      </Visibility>
    </ProvideStores>
  )
}

const OrbitAppRender = memo(({ id, identifier }: { id: string; identifier: string }) => {
  // handle url changes
  useAppLocationEffect()
  const appDef = getAppDefinition(identifier)

  if (appDef.app == null) {
    console.debug('no app', id, identifier)
    return null
  }

  return <OrbitAppRenderOfDefinition appDef={appDef} id={id} identifier={identifier} />
})

export const OrbitAppRenderOfDefinition = ({
  id,
  identifier,
  appDef,
}: {
  id: string
  identifier: string
  appDef: AppDefinition
}) => {
  const { app: App } = appDef
  const Toolbar = OrbitToolBar
  const Sidebar = OrbitSidebar
  const Main = OrbitMain
  const Statusbar = OrbitStatusBar

  return (
    <Suspense fallback={<Loading />}>
      <AppLoadContext.Provider value={{ id, identifier, appDef }}>
        <AppViewsContext.Provider value={{ Toolbar, Sidebar, Main, Statusbar }}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </AppViewsContext.Provider>
      </AppLoadContext.Provider>
    </Suspense>
  )
}

class ErrorBoundary extends Component {
  state = {
    error: null,
  }

  componentDidCatch(error) {
    console.warn('ErrorBoundary caught error')
    this.setState({
      error: {
        message: error.message,
        stack: error.stack,
      },
    })
  }

  render() {
    const { error } = this.state
    if (error) {
      return (
        <Section
          background="red"
          color="white"
          title={error.message}
          flex={1}
          minWidth={200}
          minHeight={200}
        >
          <View whiteSpace="pre-line" padding={20}>
            <pre>{error.stack}</pre>
            <Space />
            <Button alt="confirm" onClick={() => this.setState({ error: null })}>
              Clear
            </Button>
          </View>
        </Section>
      )
    }
    return this.props.children
  }
}

if (module['hot']) {
  module['hot'].accept()
}
