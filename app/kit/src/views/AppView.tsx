import { Contents, View } from '@mcro/gloss'
import { ItemPropsProviderSmall, memoIsEqualDeep } from '@mcro/ui'
import React, { forwardRef, useEffect, useRef } from 'react'
import { findDOMNode } from 'react-dom'
import { useAppView } from '../hooks/useAppView'
import { useLoadedApp } from '../hooks/useLoadedApp'
import { AppStore } from '../stores'
import { AppProps } from '../types/AppProps'
import { ProvideStores } from './ProvideStores'

export type AppViewProps = Pick<AppProps, 'title' | 'viewType' | 'isActive' | 'appConfig'> & {
  id?: string
  identifier: string
  appStore?: AppStore
  after?: React.ReactNode
  before?: React.ReactNode
  inside?: React.ReactNode
}

export type AppViewRef = {
  hasView?: boolean
}

// !TODO make this nice
function useHandleAppViewRef(ref: any, rootRef: any) {
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
}

export const AppView = memoIsEqualDeep(
  forwardRef<AppViewRef, AppViewProps>(function AppView({ before, after, inside, ...props }, ref) {
    const rootRef = useRef<HTMLDivElement>(null)

    if (!props.identifier) {
      console.log('props for error', props)
      throw new Error('No app id')
    }

    const { views, appStore, provideStores } = useLoadedApp(props.identifier, props.id)
    const AppViewAlt = useAppView(props.identifier, props.viewType as any)
    const AppView = views[props.viewType] || AppViewAlt

    // handle ref
    useHandleAppViewRef(ref, rootRef)

    if (!AppView) {
      return null
    }

    function getAppElement() {
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
    }

    return <ProvideStores stores={{ ...provideStores, appStore }}>{getAppElement()}</ProvideStores>
  }),
)
