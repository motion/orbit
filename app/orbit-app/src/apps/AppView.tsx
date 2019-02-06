import { Contents } from '@mcro/gloss'
import { useStore } from '@mcro/use-store'
import React, { forwardRef, memo, useEffect, useMemo, useRef } from 'react'
import { findDOMNode } from 'react-dom'
import { SmallListItemPropsProvider } from '../components/SmallListItemPropsProvider'
import { StoreContext } from '../contexts'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { GenericComponent } from '../types'
import { MergeContext } from '../views/MergeContext'
import { AppProps } from './AppProps'
import { apps } from './apps'
import { AppStore } from './AppStore'

export type AppViewProps = Pick<
  AppProps<any>,
  'id' | 'title' | 'viewType' | 'type' | 'isActive' | 'appConfig'
> & {
  title?: string
  appStore?: AppStore<any>
  onAppStore?: Function
}

export type AppViewRef = {
  hasView?: boolean
}

export const AppView = memo(
  forwardRef<AppViewRef, AppViewProps>(function AppView(props, ref) {
    const stores = useStoresSafe({ optional: ['appStore', 'subPaneStore'] })
    // ensure just one appStore ever is set in this tree
    // warning should never change it if you pass in a prop
    const appStore = props.appStore || useStore(AppStore, props)
    const rootRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (props.onAppStore) {
        props.onAppStore(appStore)
      }
    }, [])

    if (!apps[props.type]) {
      console.error('AppView: no app of type', props.type, props)
      return null
    }

    const AppView = apps[props.type][props.viewType] as GenericComponent<AppProps<any>>

    // handle ref
    useEffect(
      () => {
        if (!ref) return
        const current = {
          hasView: !!AppView && !!findDOMNode(rootRef.current).firstChild,
        }
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
      [ref],
    )

    const appElement = useMemo(() => {
      if (!AppView) {
        return null
      }

      const appElement = (
        <Contents ref={rootRef}>
          <AppView
            appStore={props.appStore || appStore}
            sourcesStore={stores.sourcesStore}
            settingStore={stores.settingStore}
            subPaneStore={stores.subPaneStore}
            queryStore={stores.queryStore}
            spaceStore={stores.spaceStore}
            paneManagerStore={stores.paneManagerStore}
            {...props}
          />
        </Contents>
      )

      // small rendering for index views
      if (props.viewType === 'index') {
        return <SmallListItemPropsProvider>{appElement}</SmallListItemPropsProvider>
      }

      // regular rendering for others
      return appElement
    }, Object.values(props))

    if (!props.appStore) {
      return (
        <MergeContext Context={StoreContext} value={{ appStore }}>
          {appElement}
        </MergeContext>
      )
    }

    return appElement
  }),
)
