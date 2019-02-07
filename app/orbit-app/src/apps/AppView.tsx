import { Contents } from '@mcro/gloss';
import { AppType } from '@mcro/models';
import { useStore } from '@mcro/use-store';
import React, { forwardRef, memo, useEffect, useMemo, useRef } from 'react';
import { findDOMNode } from 'react-dom';
import { SmallListItemPropsProvider } from '../components/SmallListItemPropsProvider';
import { StoreContext } from '../contexts';
import { GenericComponent } from '../types';
import { MergeContext } from '../views/MergeContext';
import { apps } from './apps';
import { AppStore } from './AppStore';
import { AppProps } from './AppTypes';

export type AppViewProps = Pick<
  AppProps,
  'id' | 'title' | 'viewType' | 'isActive' | 'appConfig'
> & {
  type: AppType
  title?: string
  appStore?: AppStore
  onAppStore?: Function
  after?: React.ReactNode
  before?: React.ReactNode
}

export type AppViewRef = {
  hasView?: boolean
}

export const AppView = memo(
  forwardRef<AppViewRef, AppViewProps>(function AppView({ before, after, ...props }, ref) {
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

    const AppView = apps[props.type][props.viewType] as GenericComponent<AppProps>

    // handle ref
    useEffect(
      () => {
        if (!ref) return
        if (!rootRef.current) return
        const hasView = !!AppView && !!findDOMNode(rootRef.current).firstChild
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

    const appElement = useMemo(() => {
      if (!AppView) {
        return null
      }

      const appElement = (
        <Contents ref={rootRef}>
          {before}
          <AppView
            appStore={props.appStore || appStore}
            {...props}
          />
          {after}
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
