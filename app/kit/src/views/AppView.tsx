import { isEqual } from '@o/fast-compare'
import { AppViewProps } from '@o/models'
import { ErrorBoundary, ItemPropsProviderSmall, Loading, memoIsEqualDeep } from '@o/ui'
import { Contents } from 'gloss'
import { capitalize } from 'lodash'
import React, { createContext, Suspense, useContext, useMemo, useRef } from 'react'

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

const ChildrenOnly = props => props.children

const AppViewContext = createContext<Partial<AppSubViewProps>>({})

export const AppView = memoIsEqualDeep(function AppView({ appProps, ...props }) {
  const prev = useContext(AppViewContext)
  const rootRef = useRef<HTMLDivElement>(null)
  const context = useMemo(() => ({ [capitalize(props.viewType)]: ChildrenOnly } as any), [
    props.viewType,
  ])
  const definition = useAppDefinition(props.identifier)

  const View = useMemo(() => {
    // prevent infinite loop of nesting, which can be relatively easy to do
    if (isEqual(prev, props)) {
      console.error(`Rendering the same view as a sub-view, preventing infinite loop.`)
      return null
    }
    if (!props.identifier) {
      console.log('props for error', props)
      return null
    }

    if (!definition) {
      console.warn('no definition found', props)
      return null
    }

    if (props.viewType === 'setup' || props.viewType === 'settings') {
      return definition[props.viewType]
    } else {
      const RenderApp = definition.app
      return next => (
        <AppViewsContext.Provider value={context}>
          <RenderApp {...next} />
        </AppViewsContext.Provider>
      )
    }
  }, [props.identifier, props.viewType, definition])

  if (View === null) {
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
})
