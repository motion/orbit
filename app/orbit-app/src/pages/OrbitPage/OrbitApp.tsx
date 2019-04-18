import { AppDefinition, AppLoadContext, AppStore, AppViewsContext, getAppDefinition, ProvideStores, useIsAppActive } from '@o/kit'
import { Button, Loading, Section, Visibility } from '@o/ui'
import { useReaction, useStoreSimple } from '@o/use-store'
import React, { Component, memo, Suspense, useCallback, useEffect } from 'react'
import '../../apps/orbitApps'
import { useAppLocationEffect } from '../../effects/useAppLocationEffect'
import { useStoresSimple } from '../../hooks/useStores'
import { OrbitMain } from './OrbitMain'
import { OrbitSidebar } from './OrbitSidebar'
import { OrbitStatusBar } from './OrbitStatusBar'
import { OrbitToolBar } from './OrbitToolBar'

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

function OrbitActions(props: { children?: any }) {
  const stores = useStoresSimple()
  const isActive = useIsAppActive()

  useEffect(() => {
    if (isActive) {
      stores.orbitStore.setActiveActions(props.children || null)
    } else {
      stores.orbitStore.setActiveActions(null)
    }
  }, [isActive, props.children])

  return null
}

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
  const Actions = OrbitActions
  const { orbitStore } = useStoresSimple()
  const appProps = useReaction(() => orbitStore.activeConfig[id] || {})

  return (
    <Suspense fallback={<Loading />}>
      <AppLoadContext.Provider value={{ id, identifier, appDef }}>
        <AppViewsContext.Provider value={{ Toolbar, Sidebar, Main, Statusbar, Actions }}>
          <ErrorBoundary name={identifier}>
            <App {...appProps} />
          </ErrorBoundary>
        </AppViewsContext.Provider>
      </AppLoadContext.Provider>
    </Suspense>
  )
}

class ErrorBoundary extends Component<{ name: string }> {
  state = {
    error: null,
  }

  componentDidCatch(error) {
    console.warn('ErrorBoundary caught error', this.props.name)
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
          background="darkorange"
          color="white"
          title={error.message || 'Error'}
          subTitle={this.props.name}
          flex={1}
          minWidth={200}
          minHeight={200}
          scrollable="y"
          whiteSpace="pre-line"
          pad
        >
          <Button alt="confirm" onClick={() => this.setState({ error: null })}>
            Clear
          </Button>
          <pre>{error.stack}</pre>
        </Section>
      )
    }
    return this.props.children
  }
}

if (module['hot']) {
  module['hot'].accept()
}
