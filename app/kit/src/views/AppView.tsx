import { Contents, View } from '@mcro/gloss'
import { ItemPropsProviderSmall, memoIsEqualDeep } from '@mcro/ui'
import React, { forwardRef, useEffect, useMemo, useRef } from 'react'
import { findDOMNode } from 'react-dom'
import { useApp } from '../hooks/useApp'
import { AppStore } from '../stores'
import { AppProps } from '../types/AppProps'
import { ProvideStores } from './ProvideStores'

export type AppViewProps = Pick<AppProps, 'title' | 'viewType' | 'isActive' | 'appConfig'> & {
  appId: string
  title?: string
  appStore?: AppStore
  after?: React.ReactNode
  before?: React.ReactNode
  inside?: React.ReactNode
}

export type AppViewRef = {
  hasView?: boolean
}

export const AppView = memoIsEqualDeep(
  forwardRef<AppViewRef, AppViewProps>(function AppView({ before, after, inside, ...props }, ref) {
    const rootRef = useRef<HTMLDivElement>(null)
    const { views, appStore, provideStores } = useApp({ id: props.appId })
    const AppView = views[props.viewType]

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
          console.warn('no views', props, AppView, appStore, views, props.viewType)
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
          return <ItemPropsProviderSmall>{appElement}</ItemPropsProviderSmall>
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
