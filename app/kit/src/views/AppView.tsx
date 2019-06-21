import { isEqual } from '@o/fast-compare'
import { AppViewProps } from '@o/models'
import {
  ItemPropsProviderSmall,
  Loading,
  memoIsEqualDeep,
  ErrorBoundary,
  CenteredText,
} from '@o/ui'
import { Contents } from 'gloss'
import { capitalize } from 'lodash'
import React, {
  createContext,
  forwardRef,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { findDOMNode } from 'react-dom'

import { useAppDefinition } from '../hooks/useAppDefinition'
import { AppStore } from '../stores'
import { AppViewsContext } from './App'

export type AppSubViewProps = {
  appProps?: AppViewProps
  viewType?: 'index' | 'main' | 'setup' | 'settings' | 'toolBar' | 'statusBar'
  id?: string
  identifier: string
  appStore?: AppStore
}

export type AppViewRef = {
  hasView?: boolean
}

// !TODO make this nice
function useHandleAppViewRef(ref: any, rootRef: any) {
  useEffect(() => {
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
  }, [ref, rootRef.current])
}

const ChildrenOnly = props => props.children

const AppViewContext = createContext<Partial<AppSubViewProps>>({})

export const AppView = memoIsEqualDeep(
  forwardRef<AppViewRef, AppSubViewProps>(function AppView({ appProps, ...props }, ref) {
    const prev = useContext(AppViewContext)
    const rootRef = useRef<HTMLDivElement>(null)
    const context = useMemo(() => ({ [capitalize(props.viewType)]: ChildrenOnly } as any), [
      props.viewType,
    ])
    const definition = useAppDefinition(props.identifier)

    // prevent infinite loop of nesting, which can be relatively easy to do
    if (isEqual(prev, props)) {
      console.error(`Rendering the same view as a sub-view, preventing infinite loop.`)
      return null
    }

    if (!props.identifier) {
      console.log('props for error', props)
      return <CenteredText>No identifier {props.identifier}</CenteredText>
    }

    let View = null

    if (!definition) {
      console.warn('no definition found', props)
      return <CenteredText>No definition found for identifier {props.identifier}</CenteredText>
    }

    if (props.viewType === 'setup' || props.viewType === 'settings') {
      View = definition[props.viewType]
    } else {
      const RenderApp = definition.app
      View = next => (
        <AppViewsContext.Provider value={context}>
          <RenderApp {...next} />
        </AppViewsContext.Provider>
      )
    }

    // handle ref
    useHandleAppViewRef(ref, rootRef)

    if (!View) {
      console.warn('no view', props, definition)
      return null
    }
    if (typeof View !== 'function') {
      console.warn('invalid view', View, props, appProps)
      return null
    }

    const element = (
      <AppViewContext.Provider value={props}>
        <Contents ref={rootRef}>
          <ErrorBoundary name={`App: ${props.identifier}`}>
            <Suspense fallback={<Loading />}>
              <View {...props} {...appProps} />
            </Suspense>
          </ErrorBoundary>
        </Contents>
      </AppViewContext.Provider>
    )

    // small rendering for index views
    if (props.viewType === 'index') {
      return <ItemPropsProviderSmall>{element}</ItemPropsProviderSmall>
    }

    // regular rendering for others
    return element
  }),
)
