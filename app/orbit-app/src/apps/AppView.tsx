import isEqual from '@mcro/fast-compare'
import { Contents, View } from '@mcro/gloss'
import { useObserver } from 'mobx-react-lite'
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { findDOMNode } from 'react-dom'
import { ProvideStores } from '../components/ProvideStores'
import { SmallListItemPropsProvider } from '../components/SmallListItemPropsProvider'
import { AllStores } from '../contexts/StoreContext'
import { memoIsEqualDeep } from '../helpers/memoIsEqualDeep'
import { useStores } from '../hooks/useStores'
import { AppStore } from './AppStore'
import { AppProps, AppViews } from './AppTypes'

export type AppViewProps = Pick<
  AppProps,
  'id' | 'title' | 'viewType' | 'isActive' | 'appConfig'
> & {
  type: string
  title?: string
  appStore?: AppStore
  after?: React.ReactNode
  before?: React.ReactNode
  inside?: React.ReactNode
}

export type AppViewRef = {
  hasView?: boolean
}

// needs either an id or a type
type GetApp = { id?: string; type?: string; appStore?: AppStore }

type AppState = {
  appViews: AppViews
  appStore: AppStore
  provideStores: Object
}

// apps can be "static" like onboarding/settings
// or dynamic like an instantiated list/search/custom app
// so we use type for static, id for dynamic.
function getApp(props: GetApp, stores: AllStores): AppState {
  const next = {
    appStore: props.appStore || stores.appStore || null,
    appViews: {},
    provideStores: null,
  }

  if (stores.appsStore) {
    const state = stores.appsStore.appsState
    if (!state) return next
    const { appStores, appViews, provideStores } = state
    // set store
    if (!next.appStore) {
      next.appStore = appStores[props.id] || appStores[props.type]
    }
    // set view
    next.appViews = appViews[props.id] || appViews[props.type] || {}
    next.provideStores = provideStores[props.id] || provideStores[props.type] || null
  }

  return next
}

export function useApp(props: GetApp | false) {
  const stores = useStores({ optional: ['appStore', 'appsStore'] })
  const currentState = useRef<AppState>({
    appViews: {},
    appStore: null,
    provideStores: null,
  })
  const [version, update] = useState(0)

  if (version === 0 && props) {
    currentState.current = getApp(props, stores)
  }

  useObserver(() => {
    if (!props) return
    const next = getApp(props, stores)
    // set if necessary
    if (next === currentState.current) return
    if (isEqual(next, currentState.current)) return
    currentState.current = next
    update(Math.random())
  })

  return currentState.current
}

export const AppView = memoIsEqualDeep(
  forwardRef<AppViewRef, AppViewProps>(function AppView({ before, after, inside, ...props }, ref) {
    const rootRef = useRef<HTMLDivElement>(null)
    const { appViews, appStore, provideStores } = useApp(props)
    const AppView = appViews[props.viewType]

    // handle ref
    useEffect(
      () => {
        if (!ref) return
        if (!rootRef.current) return
        const domNode = findDOMNode(rootRef.current)
        const hasView = !!domNode.firstChild
        const current = { hasView }
        if (typeof ref === 'function') {
          ref(current)
        } else {
          // @ts-ignore
          ref.current = current
          return () => {
            // @ts-ignore
            ref.current = null
          }
        }
      },
      [ref, rootRef.current],
    )

    const appElement = useMemo(
      () => {
        if (!AppView || !appStore) {
          return null
        }

        const appElement = (
          <Contents ref={rootRef}>
            {before || null}
            <View position="relative" overflow="hidden" flex={1}>
              {inside}
              <AppView appStore={appStore} {...props} />
            </View>
            {after || null}
          </Contents>
        )

        // small rendering for index views
        if (props.viewType === 'index') {
          return <SmallListItemPropsProvider>{appElement}</SmallListItemPropsProvider>
        }

        // regular rendering for others
        return appElement
      },
      // never update, once we have our stuff
      [appStore, AppView],
    )

    if (!appElement) {
      return null
    }

    return <ProvideStores stores={{ ...provideStores, appStore }}>{appElement}</ProvideStores>
  }),
)
