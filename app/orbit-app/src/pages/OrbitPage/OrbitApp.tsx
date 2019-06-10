import '../../apps/orbitApps'

import { isEqual } from '@o/fast-compare'
import { App, AppDefinition, AppLoadContext, AppStore, AppViewProps, AppViewsContext, Bit, getAppDefinition, getAppDefinitions, ProvideStores, ScopedState, sleep } from '@o/kit'
import { ErrorBoundary, gloss, ListItemProps, Loading, ProvideShare, useGet, useThrottledFn, useVisibility, View, Visibility } from '@o/ui'
import { useStoreSimple } from '@o/use-store'
import { Box } from 'gloss'
import React, { memo, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'

import { useStoresSimple } from '../../hooks/useStores'
import { useOm } from '../../om/om'
import { usePaneManagerStore } from '../../om/stores'
import { OrbitMain } from './OrbitMain'
import { OrbitSidebar } from './OrbitSidebar'
import { OrbitStatusBar } from './OrbitStatusBar'
import { OrbitToolBar } from './OrbitToolBar'

type OrbitAppProps = {
  id: string
  identifier: string
  appDef?: AppDefinition
  hasShownOnce?: boolean
}

export const OrbitApp = ({ id, identifier, appDef, hasShownOnce }: OrbitAppProps) => {
  const { orbitStore } = useStoresSimple()
  const paneManagerStore = usePaneManagerStore()
  const isActive = paneManagerStore.activePane.id === id
  const appStore = useStoreSimple(AppStore, {
    id,
    identifier,
  })
  // this is used for initial show/animation
  const [shown, setShown] = useState(false)
  // this is used to set display flex/none based on visibility to avoid too much on screen
  const [appVisibility, setAppVisibility] = useState(isActive)

  useLayoutEffect(() => {
    // set shown
    if (isActive && !hasShownOnce) {
      setShown(true)
    }
    if (isActive) {
      orbitStore.setActiveAppStore(appStore)
    }

    // set appVisibility
    let tm
    if (isActive) {
      setAppVisibility(true)
    } else {
      tm = setTimeout(() => {
        setAppVisibility(false)
      }, 1000)
    }
    return () => {
      clearTimeout(tm)
    }
  }, [orbitStore, appStore, isActive, hasShownOnce])

  return (
    <Suspense fallback={<div>error loading app {identifier} {id}</div>}>
      <View className="orbit-app" flex={1} display={isActive || appVisibility ? 'flex' : 'none'}>
        <ScopedState id={`app-${identifier}-${id}-`}>
          <ProvideStores stores={{ appStore }}>
            <Visibility visible={isActive}>
              <OrbitAppRender
                id={id}
                identifier={identifier}
                hasShownOnce={hasShownOnce || shown}
                appDef={appDef}
              />
            </Visibility>
          </ProvideStores>
        </ScopedState>
      </View>
    </Suspense>
  )
}

type AppRenderProps = OrbitAppProps

const OrbitAppRender = memo((props: AppRenderProps) => {
  const appDef = props.appDef || getAppDefinition(props.identifier)
  if (appDef.app == null) {
    console.warn('no app', props)
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
  const om = useOm()
  const Toolbar = OrbitToolBar
  const Sidebar = OrbitSidebar
  const Main = OrbitMain
  const Statusbar = OrbitStatusBar
  const Actions = OrbitActions
  const [activeItem, setActiveItem] = useState(null)
  const getActiveItem = useGet(activeItem)
  const setActiveItemThrottled = useThrottledFn(setActiveItem, { amount: 250 })

  const onChangeShare = useCallback((location, items) => {
    items = !items || Object.keys(items).length === 0 ? null : items
    if (location === 'main') {
      const next = items ? getAppProps(items[0]) : null
      if (isEqual(next, getActiveItem())) return
      setActiveItemThrottled(next)
    }
    if (location === 'main') {
      om.actions.setShare({ key: `app-${id}`, value: items })
    }
  }, [])

  let AppDefMain = appDef.app

  // test to see if they wrapped with <App>
  const appChildEl = AppDefMain({})
  const isAppWrapped = !!(appChildEl && appChildEl.type['isApp'])

  // must memo to avoid remounting
  const FinalAppView = useMemo(() => {
    if (isAppWrapped) {
      return AppDefMain
    }
    return props => (
      <App>
        <AppDefMain {...props} />
      </App>
    )
  }, [isAppWrapped, AppDefMain])

  return (
    <ErrorBoundary name={identifier}>
      <Suspense fallback={<Loading />}>
        <ProvideShare onChange={onChangeShare}>
          <AppLoadContext.Provider value={{ id, identifier, appDef }}>
            <AppViewsContext.Provider value={{ Toolbar, Sidebar, Main, Statusbar, Actions }}>
              {hasShownOnce && (
                <FadeIn>
                  <FinalAppView
                    {...activeItem}
                    identifier={(activeItem && activeItem.identifier) || identifier}
                    id={(activeItem && activeItem.id) || id}
                  />
                </FadeIn>
              )}
            </AppViewsContext.Provider>
          </AppLoadContext.Provider>
        </ProvideShare>
      </Suspense>
    </ErrorBoundary>
  )
}

function getAppProps(props: ListItemProps): AppViewProps {
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

export function getSourceAppProps(appDef: AppDefinition, model: Bit): AppViewProps {
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

const FadeInDiv = gloss(Box, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  transition: 'all ease 200ms',
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
})

const FadeIn = (props: any) => {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    let off = false
    Promise.race([sleep(100), onIdle()]).then(() => !off && setShown(true))
    return () => {
      off = true
    }
  }, [])

  return (
    <FadeInDiv
      style={{
        opacity: shown ? 1 : 0,
        transform: `translateX(${shown ? 0 : -10}px)`,
      }}
    >
      {props.children}
    </FadeInDiv>
  )
}

function OrbitActions(props: { children?: any }) {
  const stores = useStoresSimple()
  const isActive = useVisibility()
  useEffect(() => {
    if (isActive) {
      stores.orbitStore.setActiveActions(props.children || null)
    } else {
      stores.orbitStore.setActiveActions(null)
    }
  }, [isActive, props.children])
  return null
}

// if (module['hot']) {
//   module['hot'].accept()
// }
