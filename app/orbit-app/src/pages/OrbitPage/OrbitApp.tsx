import '../../apps/orbitApps'

import {
  AppDefinition,
  AppLoadContext,
  AppProps,
  AppStore,
  AppViewsContext,
  Bit,
  getAppDefinition,
  getAppDefinitions,
  ProvideStores,
  sleep,
  useIsAppActive,
} from '@o/kit'
import { ErrorBoundary, ListItemProps, Loading, ProvideShare, ProvideVisibility, useShareStore, useThrottleFn } from '@o/ui'
import { useReaction, useStoreSimple } from '@o/use-store'
import React, { memo, Suspense, useCallback, useEffect, useState } from 'react'

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
  const [hasShownOnce, setHasShownOnce] = useState(false)

  useEffect(() => {
    if (isActive && !hasShownOnce) {
      setHasShownOnce(true)
    }
  }, [isActive, hasShownOnce])

  return (
    <ProvideStores stores={{ appStore }}>
      <ProvideVisibility visible={isActive}>
        <OrbitAppRender id={id} identifier={identifier} hasShownOnce={hasShownOnce} />
      </ProvideVisibility>
    </ProvideStores>
  )
}

type AppRenderProps = { id: string; identifier: string; hasShownOnce?: boolean }

const OrbitAppRender = memo((props: AppRenderProps) => {
  // handle url changes
  useAppLocationEffect()
  // get definition
  const appDef = getAppDefinition(props.identifier)
  if (appDef.app == null) {
    console.debug('no app', props)
    return null
  }
  return <OrbitAppRenderOfDefinition appDef={appDef} {...props} />
})

export const OrbitAppRenderOfDefinition = ({
  id,
  identifier,
  appDef,
  hasShownOnce,
}: AppRenderProps & {
  appDef: AppDefinition
}) => {
  const { app: App } = appDef
  const Toolbar = OrbitToolBar
  const Sidebar = OrbitSidebar
  const Main = OrbitMain
  const Statusbar = OrbitStatusBar
  const Actions = OrbitActions
  const globalShareStore = useShareStore()
  const [activeItem, setActiveItem] = useState(null)
  const setActiveItemThrottled = useThrottleFn(setActiveItem, { amount: 250 })

  const onChangeShare = useCallback((location, items) => {
    console.log('on change', location, items)
    if (location === 'main') {
      setActiveItemThrottled(getAppProps(items[0]))
    }
    if (location === 'main') {
      globalShareStore.setSelected(`app-${id}`, items)
    }
  }, [])

  return (
    <ProvideShare onChange={onChangeShare}>
      <AppLoadContext.Provider value={{ id, identifier, appDef }}>
        <AppViewsContext.Provider value={{ Toolbar, Sidebar, Main, Statusbar, Actions }}>
          <ErrorBoundary name={identifier}>
            <Suspense fallback={<Loading />}>
              {hasShownOnce && (
                <FadeIn>
                  <App identifier={identifier} id={id} {...activeItem} />
                </FadeIn>
              )}
            </Suspense>
          </ErrorBoundary>
        </AppViewsContext.Provider>
      </AppLoadContext.Provider>
    </ProvideShare>
  )
}

function getAppProps(props: ListItemProps): AppProps {
  if (!props) {
    return {}
  }
  const { item } = props
  if (item) {
    if (item.target === 'bit') {
      const appDef = getAppDefinitions().find(x => x.id === item.appIdentifier)
      return getSourceAppProps(appDef, item)
    }
    if (item.target === 'person-bit') {
      const appDef = getAppDefinitions().find(x => x.id === 'people')
      return getSourceAppProps(appDef, item)
    }
  }
  return {
    id: props.id,
    identifier: props.identifier,
    // dont accept react elements
    title: typeof props.title === 'string' ? props.title : undefined,
    icon: typeof props.icon === 'string' ? props.icon : undefined,
    subType: props.subType,
    subId: props.subId ? `${props.subId}` : undefined,
    ...props.extraData,
  }
}

export function getSourceAppProps(appDef: AppDefinition, model: Bit): AppProps {
  if (!appDef) {
    throw new Error(`No source given: ${JSON.stringify(appDef)}`)
  }
  return {
    id: `${model.id}`,
    icon: appDef.icon,
    iconLight: appDef.iconLight,
    title: model.target === 'bit' ? model.title : model['name'],
    identifier: model ? model.target : 'sources',
  }
}

const onIdle = () => new Promise(res => window['requestIdleCallback'](res))

const FadeIn = (props: any) => {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    Promise.race([sleep(100), onIdle()]).then(() => setShown(true))
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: shown ? 1 : 0,
        transform: `translateY(${shown ? 0 : -10}px)`,
        transition: 'all ease 200ms',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {props.children}
    </div>
  )
}

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

if (module['hot']) {
  module['hot'].accept()
}
