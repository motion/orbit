import { react } from '@mcro/black'
import { Contents, View } from '@mcro/gloss'
import { useHook, useStore } from '@mcro/use-store'
import React, { forwardRef, useEffect, useMemo, useRef } from 'react'
import { findDOMNode } from 'react-dom'
import { ProvideStores } from '../components/ProvideStores'
import { SmallListItemPropsProvider } from '../components/SmallListItemPropsProvider'
import { memoIsEqualDeep } from '../helpers/memoIsEqualDeep'
import { useStoresSimple } from '../hooks/useStores'
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
type UseAppProps = { id?: string; type?: string; appStore?: AppStore }
type AppState = {
  appViews: AppViews
  appStore: AppStore
  provideStores: Object
}

class CurrentAppStore {
  props: UseAppProps
  stores = useHook(useStoresSimple)
  state = react(
    () => {
      const { stores, props } = this
      const next: AppState = {
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
    },
    async (next, { sleep }) => {
      // avoid waterfall updates no initial load
      await sleep(10)
      return next
    },
  )
}

export function useApp(props: UseAppProps) {
  const currentAppStore = useStore(CurrentAppStore, props)
  return (
    currentAppStore.state || {
      appStore: null,
      appViews: {},
      provideStores: {},
    }
  )
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
