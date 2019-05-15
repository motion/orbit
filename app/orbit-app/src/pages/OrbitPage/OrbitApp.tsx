import '../../apps/orbitApps'

import { isEqual } from '@o/fast-compare'
import { App, AppDefinition, AppLoadContext, AppProps, AppStore, AppViewsContext, Bit, getAppDefinition, getAppDefinitions, ProvideStores, ScopedState, sleep } from '@o/kit'
import { ErrorBoundary, ListItemProps, Loading, ProvideShare, ProvideVisibility, useGet, useThrottleFn, useVisibility } from '@o/ui'
import { useStoreSimple } from '@o/use-store'
import React, { memo, Suspense, useCallback, useEffect, useMemo, useState } from 'react'

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
  const paneManagerStore = usePaneManagerStore()
  const isActive = paneManagerStore.activePane.id === id
  const appStore = useStoreSimple(AppStore, {
    id,
    identifier,
  })
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (isActive && !hasShownOnce) {
      setShown(true)
    }
  }, [isActive, hasShownOnce])

  return (
    <ScopedState id={`appstate-${identifier}-${id}-`}>
      <ProvideStores stores={{ appStore }}>
        <ProvideVisibility visible={isActive}>
          <OrbitAppRender
            id={id}
            identifier={identifier}
            hasShownOnce={hasShownOnce || shown}
            appDef={appDef}
          />
        </ProvideVisibility>
      </ProvideStores>
    </ScopedState>
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
  const setActiveItemThrottled = useThrottleFn(setActiveItem, { amount: 250 })

  const onChangeShare = useCallback((location, items) => {
    console.log('share', items)
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
    <ProvideShare onChange={onChangeShare}>
      <AppLoadContext.Provider value={{ id, identifier, appDef }}>
        <AppViewsContext.Provider value={{ Toolbar, Sidebar, Main, Statusbar, Actions }}>
          <ErrorBoundary name={identifier}>
            <Suspense fallback={<Loading />}>
              {hasShownOnce && (
                <FadeIn>
                  <FinalAppView {...activeItem} identifier={identifier} id={id} />
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
    let off = false
    Promise.race([sleep(100), onIdle()]).then(() => !off && setShown(true))
    return () => {
      off = true
    }
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
        transform: `translateX(${shown ? 0 : -10}px)`,
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
