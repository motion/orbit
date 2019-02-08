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
  onAppStore?: Function
  after?: React.ReactNode
  before?: React.ReactNode
}

export type AppViewRef = {
  hasView?: boolean
}

type GetAppViewProps = Partial<Pick<AppProps, 'id' | 'viewType' | 'appStore'>> & { type?: string }

function getAppViewProps(props: GetAppViewProps, stores: AllStores) {
  const next = {
    appStore: props.appStore || stores.appStore,
    AppView: null,
  }
  if (!next.appStore && stores.appsStore) {
    next.appStore = stores.appsStore.appStores[props.id]
  }
  let views: any
  if (stores.appsStore) {
    views = stores.appsStore.appViews[props.id]
  }
  if (!views) {
    views = apps[props.type] || {}
  }
  // get view type
  next.AppView = views[props.viewType]
  return next
}

export function useAppView(props: GetAppViewProps) {
  const stores = useStoresSafe({ optional: ['appStore', 'appsStore'] })
  const currentState = useRef(null)
  const [_, update] = useState(0)

  if (!currentState.current) {
    currentState.current = getAppViewProps(props, stores)
  }

  useObserver(() => {
    const next = getAppViewProps(props, stores)
    // set if necessary
    if (!isEqual(next, currentState.current)) {
      currentState.current = next
      update(Math.random())
    }
  })

  console.log('return', currentState.current)
  return currentState.current
}

export const AppView = memo(
  forwardRef<AppViewRef, AppViewProps>(function AppView({ before, after, ...props }, ref) {
    const rootRef = useRef<HTMLDivElement>(null)
    const { AppView, appStore } = useAppView(props)

    useEffect(() => {
      if (appStore && props.onAppStore) {
        props.onAppStore(appStore)
      }
    }, [])

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
      [appStore],
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
