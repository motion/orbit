import { Contents } from '@mcro/gloss'
import { useObserver } from 'mobx-react-lite'
import React, { forwardRef, memo, useEffect, useMemo, useRef, useState } from 'react'
import { findDOMNode } from 'react-dom'
import isEqual from 'react-fast-compare'
import { SmallListItemPropsProvider } from '../components/SmallListItemPropsProvider'
import { StoreContext } from '../contexts'
import { AllStores } from '../contexts/StoreContext'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { MergeContext } from '../views/MergeContext'
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
}

export type AppViewRef = {
  hasView?: boolean
}

// needs either an id or a type
type GetAppViewProps = { id?: string; type?: string; appStore?: AppStore }

type AppState = {
  appViews: AppViews
  appStore: AppStore
}

// apps can be "static" like onboarding/settings
// or dynamic like an instantiated list/search/custom app
// so we use type for static, id for dynamic.
function getAppViewProps(props: GetAppViewProps, stores: AllStores): AppState {
  const next = {
    appStore: props.appStore || stores.appStore || null,
    appViews: {},
  }

  if (stores.appsStore) {
    const { appStores, appViews } = stores.appsStore
    // set store
    if (!next.appStore) {
      next.appStore = appStores[props.id] || appStores[props.type]
    }
    // set view
    next.appViews = appViews[props.id] || appViews[props.type] || {}
  }

  return next
}

export function useApp(props: GetAppViewProps | false) {
  const stores = useStoresSafe({ optional: ['appStore', 'appsStore'] })
  const currentState = useRef<AppState>({
    appViews: {},
    appStore: null,
  })
  const [version, update] = useState(0)

  if (version === 0 && props) {
    currentState.current = getAppViewProps(props, stores)
  }

  useObserver(() => {
    if (!props) return
    const next = getAppViewProps(props, stores)
    // set if necessary
    if (!isEqual(next, currentState.current)) {
      currentState.current = next
      update(Math.random())
    }
  })

  return currentState.current
}

export const AppView = memo(
  forwardRef<AppViewRef, AppViewProps>(function AppView({ before, after, ...props }, ref) {
    const rootRef = useRef<HTMLDivElement>(null)
    console.log('looking up', props.id, props.type)
    const { appViews, appStore } = useApp(props)
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
          console.log('no dice', props)
          return null
        }

        const appElement = (
          <Contents ref={rootRef}>
            {before || null}
            <AppView appStore={props.appStore || appStore} {...props} />
            {after || null}
          </Contents>
        )

        // small rendering for index views
        if (props.viewType === 'index') {
          console.log(props, appElement)
          return <SmallListItemPropsProvider>{appElement}</SmallListItemPropsProvider>
        }

        // regular rendering for others
        return appElement
      },
      // never update, once we have our stuff
      [appStore, AppView],
    )

    if (!appElement) {
      console.debug('AppView: no app of type', props.type, props.viewType)
      return null
    }

    return (
      <MergeContext Context={StoreContext} value={{ appStore }}>
        {appElement}
      </MergeContext>
    )
  }),
)
