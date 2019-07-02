import '../../apps/orbitApps'

import { isEqual } from '@o/fast-compare'
import { App, AppDefinition, AppLoadContext, AppStore, AppViewProps, AppViewsContext, Bit, getAppDefinition, getAppDefinitions, ProvideStores, sleep } from '@o/kit'
import { ErrorBoundary, gloss, isDefined, ListItemProps, Loading, ProvideShare, ProvideVisibility, ScopedState, useGet, useThrottledFn, useVisibility, View } from '@o/ui'
import { useStoreSimple } from '@o/use-store'
import { Box } from 'gloss'
import React, { memo, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'

import { useStoresSimple } from '../../hooks/useStores'
import { useOm } from '../../om/om'
import { useOrbitStore, usePaneManagerStore } from '../../om/stores'
import { OrbitMain } from './OrbitMain'
import { OrbitSidebar } from './OrbitSidebar'
import { OrbitStatusBar } from './OrbitStatusBar'
import { OrbitToolBar } from './OrbitToolBar'

type OrbitAppProps = {
  id: number
  identifier: string
  appDef?: AppDefinition
  renderApp?: boolean
  isDisabled?: boolean
}

export const OrbitApp = memo(({ id, identifier, appDef, renderApp, isDisabled }: OrbitAppProps) => {
  const orbitStore = useOrbitStore({ react: false })
  const paneManagerStore = usePaneManagerStore()

  const isActive =
    !isDisabled &&
    // on active pane
    paneManagerStore.activePane.id === `${id}`

  const appStore = useStoreSimple(AppStore, {
    id,
    identifier,
  })

  useLayoutEffect(() => {
    if (isActive) {
      orbitStore.setActiveAppStore(appStore)
    }
  }, [orbitStore, appStore, isActive, renderApp])

  return (
    <Suspense
      fallback={
        <div>
          error loading app {identifier} {id}
        </div>
      }
    >
      <View className={`orbit-app ${isActive ? 'is-active' : 'non-active'}`} flex={1}>
        <ScopedState id={`or-${identifier}-${id}`}>
          <ProvideStores stores={{ appStore }}>
            <ProvideVisibility visible={isActive}>
              <OrbitAppRender
                id={id}
                identifier={identifier}
                renderApp={renderApp}
                appDef={appDef}
              />
            </ProvideVisibility>
          </ProvideStores>
        </ScopedState>
      </View>
    </Suspense>
  )
})

type AppRenderProps = OrbitAppProps

const OrbitAppRender = memo((props: AppRenderProps) => {
  const appDef = props.appDef || getAppDefinition(props.identifier)
  if (appDef.app == null) {
    console.warn('no app', props)
    return null
  }
  return (
    <Suspense fallback={<Loading />}>
      <OrbitAppRenderOfDefinition appDef={appDef} {...props} />
    </Suspense>
  )
})

export const OrbitAppRenderOfDefinition = ({
  id,
  identifier,
  appDef,
  renderApp,
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
  const isAppWrapped = useIsAppWrapped(appDef)

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
    <ProvideShare onChange={onChangeShare}>
      <AppLoadContext.Provider value={{ id, identifier, appDef }}>
        <AppViewsContext.Provider value={{ Toolbar, Sidebar, Main, Statusbar, Actions }}>
          <ErrorBoundary name={`OrbitApp: ${identifier}`}>
            <Suspense fallback={<Loading />}>
              {renderApp && (
                <FadeIn>
                  <FinalAppView
                    {...activeItem}
                    identifier={(activeItem && activeItem.identifier) || identifier}
                    id={(activeItem && activeItem.id) || id}
                  />
                </FadeIn>
              )}
            </Suspense>
          </ErrorBoundary>
        </AppViewsContext.Provider>
      </AppLoadContext.Provider>
    </ProvideShare>
  )
}

let isWrappedCache = {}

const useIsAppWrapped = (appDef: AppDefinition) => {
  let cache = isWrappedCache[appDef.id]
  if (cache) {
    if (isDefined(cache.res)) {
      return cache.res
    }
    throw cache.promise
  }
  cache = isWrappedCache[appDef.id] = {
    res: undefined,
    promise: new Promise(res => {
      // to avoid suspense running here from child view
      setTimeout(() => {
        let isAppWrapped = false
        try {
          const appChildEl = appDef.app({})
          isAppWrapped = !!(appChildEl && appChildEl.type['isApp'])
        } catch (err) {
          if (err.message.indexOf('Invalid hook call') > -1) {
            // ignore
          } else {
            console.error(err)
          }
        }
        cache.res = isAppWrapped
        res(isAppWrapped)
      })
    }),
  }
  throw isWrappedCache[appDef.id].promise
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

export const whenIdle = () => new Promise(res => window['requestIdleCallback'](res))

const FadeInDiv = gloss(Box, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  transition: 'all ease 200ms',
  width: '100%',
  height: '100%',
})

const FadeIn = (props: any) => {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    let off = false
    Promise.race([sleep(100), whenIdle()]).then(() => !off && setShown(true))
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

const OrbitActions = memo((props: { children?: any }) => {
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
})

// if (module['hot']) {
//   module['hot'].accept()
// }
