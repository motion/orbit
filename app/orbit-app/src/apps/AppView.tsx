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
import { AppViews } from './App'
import { apps } from './apps'
import { AppStore } from './AppStore'
import { AppProps } from './AppTypes'

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
type GetAppViewProps =
  | { id: string; type?: string; appStore?: AppStore }
  | { id?: string; type: string; appStore?: AppStore }

type AppState = {
  appViews: AppViews
  appStore: AppStore
}

function getAppViewProps(props: GetAppViewProps, stores: AllStores): AppState {
  const next = {
    appStore: props.appStore || stores.appStore || null,
    appViews: null,
  }

  // set store
  if (!next.appStore && stores.appsStore) {
    next.appStore = stores.appsStore.appStores[props.id]
  }

  // set view
  if (stores.appsStore) {
    next.appViews = stores.appsStore.appViews[props.id]
  }
  if (!next.appViews) {
    next.appViews = apps[props.type] || {}
  }

  return next
}

export function useApp(props: GetAppViewProps | false) {
  const stores = useStoresSafe({ optional: ['appStore', 'appsStore'] })
  const currentState = useRef<AppState>({
    appViews: null,
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
          return <SmallListItemPropsProvider>{appElement}</SmallListItemPropsProvider>
        }

        // regular rendering for others
        return appElement
        // never update
      },
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
