import { Contents } from '@mcro/gloss'
import { ItemPropsProviderSmall, memoIsEqualDeep } from '@mcro/ui'
import { capitalize } from 'lodash'
import React, { forwardRef, useEffect, useRef } from 'react'
import { findDOMNode } from 'react-dom'
import { getAppDefinition } from '../helpers/getAppDefinition'
import { AppStore } from '../stores'
import { AppProps } from '../types/AppProps'
import { AppViewsContext } from './App'

export type AppViewProps = Pick<AppProps, 'title' | 'viewType' | 'isActive' | 'appConfig'> & {
  id?: string
  identifier: string
  appStore?: AppStore
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

const ChildrenOnly = props => props.children

export const AppView = memoIsEqualDeep(
  forwardRef<AppViewRef, AppViewProps>(function AppView(props, ref) {
    const rootRef = useRef<HTMLDivElement>(null)

    if (!props.identifier) {
      console.log('props for error', props)
      throw new Error('No app id')
    }

    const definition = getAppDefinition(props.identifier)
    let View = null

    if (props.viewType === 'setup' || props.viewType === 'settings') {
      View = definition[props.viewType]
    } else {
      const RenderApp = definition.app
      const context = { [capitalize(props.viewType)]: ChildrenOnly } as any
      console.log('context', context)
      View = props => (
        <AppViewsContext.Provider value={context}>
          <RenderApp {...props} />
        </AppViewsContext.Provider>
      )
    }

    if (!View) {
      console.warn('no view', props, definition)
      return null
    }

    // handle ref
    useHandleAppViewRef(ref, rootRef)

    const element = (
      <Contents ref={rootRef}>
        <View {...props} />
      </Contents>
    )

    // small rendering for index views
    if (props.viewType === 'index') {
      return <ItemPropsProviderSmall>{element}</ItemPropsProviderSmall>
    }

    // regular rendering for others
    return element
  }),
)
