import { isEqual } from '@o/fast-compare'
import { App, AppDefinition, AppLoadContext, AppStore, AppViewProps, AppViewsContext, Bit, getAppDefinition, getApps, ProvideStores, RenderAppFn, useAppBit } from '@o/kit'
import { ErrorBoundary, gloss, isDefined, ListItemProps, Loading, ProvideShare, ProvideVisibility, ScopedState, selectDefined, useGet, useThrottledFn, useVisibility, View } from '@o/ui'
import { useReaction, useStoreSimple } from '@o/use-store'
import { Box } from 'gloss'
import React, { memo, Suspense, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'

import { useOm } from '../../om/om'
import { orbitStore, paneManagerStore } from '../../om/stores'
import { OrbitMain } from './OrbitMain'
import { OrbitSidebar } from './OrbitSidebar'
import { OrbitStatusBar } from './OrbitStatusBar'
import { OrbitToolBar } from './OrbitToolBar'

type OrbitAppProps = {
  id: number
  identifier: string
  appDef?: AppDefinition
  shouldRenderApp?: boolean
  disableInteraction?: boolean
  isVisible?: boolean
  renderApp?: RenderAppFn
}

export const OrbitApp = memo(
  ({
    id,
    identifier,
    appDef,
    shouldRenderApp,
    disableInteraction,
    renderApp,
    isVisible,
  }: OrbitAppProps) => {
    const isActive = useReaction(() => {
      return selectDefined(
        isVisible,
        !disableInteraction && paneManagerStore.activePane.id === `${id}`,
      )
    }, [disableInteraction])

    const appStore = useStoreSimple(AppStore, {
      id,
      identifier,
    })

    useLayoutEffect(() => {
      if (isActive) {
        orbitStore.setActiveAppStore(appStore)
      }
    }, [orbitStore, appStore, isActive, shouldRenderApp])

    return (
      <Suspense
        fallback={
          <div>
            error loading app {identifier} {id}
          </div>
        }
      >
        <View
          className={`orbit-app ${isActive ? 'is-active' : 'non-active'}`}
          flex={1}
          pointerEvents={disableInteraction ? 'none' : 'inherit'}
        >
          <ScopedState id={`app-${identifier}-${id}`}>
            <ProvideStores stores={{ appStore }}>
              <ProvideVisibility visible={isActive}>
                <OrbitAppRender
                  id={id}
                  identifier={identifier}
                  shouldRenderApp={selectDefined(shouldRenderApp, true)}
                  appDef={appDef}
                  renderApp={renderApp}
                />
              </ProvideVisibility>
            </ProvideStores>
          </ScopedState>
        </View>
      </Suspense>
    )
  },
)

const OrbitAppRender = memo((props: OrbitAppProps) => {
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
  shouldRenderApp,
  renderApp,
}: OrbitAppProps & {
  appDef: AppDefinition
}) => {
  const [app] = useAppBit(id)
  const om = useOm()
  const [activeItem, setActiveItem] = useState<AppViewProps | null>(null)
  const getActiveItem = useGet(activeItem)
  const setActiveItemThrottled = useThrottledFn(setActiveItem, { amount: 250 })
  const appViewsContext = useContext(AppViewsContext)

  const onChangeShare = useCallback((location, items) => {
    items = !items || Object.keys(items).length === 0 ? [] : items
    if (location === 'main') {
      const next = items ? getAppProps(items[0]) : null
      if (!isEqual(next, getActiveItem())) {
        setActiveItemThrottled(next)
      }
    }
    if (location === 'main') {
      om.actions.setShare({
        id: `app-${id}`,
        value: {
          id,
          name: app!.name!,
          identifier,
          items,
        },
      })
    }
  }, [])

  let AppDefMain = appDef.app!

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

  const appElement = useMemo(
    () =>
      shouldRenderApp && (
        <FadeIn>
          <FinalAppView
            {...activeItem}
            identifier={(activeItem && activeItem!.identifier) || identifier}
            id={`${(activeItem && activeItem!.id) || id}`}
          />
        </FadeIn>
      ),
    [shouldRenderApp, activeItem, id, identifier],
  )

  const viewsContext = useMemo(
    () => ({
      Toolbar: OrbitToolBar,
      Sidebar: OrbitSidebar,
      Main: OrbitMain,
      Statusbar: OrbitStatusBar,
      Actions: OrbitActions,
      ...appViewsContext,
      renderApp: renderApp!,
    }),
    [renderApp, appViewsContext],
  )

  const appLoadContext = useMemo(() => ({ id, identifier, appDef }), [id, identifier, appDef])

  return (
    <ProvideShare onChange={onChangeShare}>
      <AppLoadContext.Provider value={appLoadContext}>
        <AppViewsContext.Provider value={viewsContext}>
          <ErrorBoundary name={`OrbitApp: ${identifier}`} displayInline>
            <Suspense fallback={<Loading />} {...{ delayMs: 400 }}>
              {appElement}
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
      const finish = (val: boolean = false) => {
        cache.res = val
        res(val)
      }

      // to avoid suspense running here from child view
      setTimeout(() => {
        try {
          // NOTE OF HACKINESS
          // this will upset react because its "outside" the render
          const appView = appDef && appDef.app && appDef.app
          if (!appView || typeof appView !== 'function') {
            return finish(false)
          }
          const appChildEl = appView({})
          return finish(!!(appChildEl && appChildEl.type && appChildEl.type['isApp']))
        } catch (err) {
          if (err.message.indexOf('Invalid hook call') > -1) {
            // ignore
            /// what should we do by default here?
            return finish(true)
          } else {
            console.debug(err)
          }
        }
        return finish(false)
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
      const appDef = getApps().find(x => x.id === item.appIdentifier)
      return getSourceAppProps(appDef, item)
    }
    if (item.target === 'person-bit') {
      const appDef = getApps().find(x => x.id === 'people')
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

export function getSourceAppProps(appDef?: AppDefinition, model?: Bit): AppViewProps {
  if (!appDef || !model) {
    throw new Error(`No app definition or model: ${JSON.stringify(appDef)}`)
  }
  return {
    id: `${model.id}`,
    icon: appDef.icon,
    iconLight: appDef.iconLight,
    title: model.target === 'bit' ? model.title : model['name'],
    identifier: model ? model.target : 'sources',
  }
}

export const whenIdle = ({ timeout = 600 }: { timeout?: number } = {}) =>
  new Promise(res => window['requestIdleCallback'](res, { timeout }))

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
    whenIdle({ timeout: 600 }).then(() => !off && setShown(true))
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
  const isActive = useVisibility()
  useEffect(() => {
    if (isActive) {
      orbitStore.setActiveActions(props.children || null)
    } else {
      orbitStore.setActiveActions(null)
    }
    return () => {
      orbitStore.setActiveActions(null)
    }
  }, [isActive, props.children])
  return null
})
