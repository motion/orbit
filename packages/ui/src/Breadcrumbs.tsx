import { Row, ViewProps } from '@o/gloss'
import React, { createContext, Dispatch, ReactNode, useContext, useEffect, useReducer, useRef, useState } from 'react'
import { MergeContext } from './helpers/MergeContext'
import { Text, TextProps } from './text/Text'

type BreadcrumbActions = { type: 'mount'; value: any } | { type: 'unmount'; value: any }

const BreadcrumbsContext = createContext<{
  children: number[]
  dispatch: Dispatch<BreadcrumbActions>
} | null>(null)

function breadcrumbsReducer(state: { children: Set<any> }, action: BreadcrumbActions) {
  switch (action.type) {
    case 'mount':
      state.children.add(action.value)
      return state
    case 'unmount':
      state.children.delete(action.value)
      return state
  }
  return state
}

export function Breadcrumbs(props: ViewProps) {
  const [state, dispatch] = useReducer(breadcrumbsReducer, { children: new Set() })
  const [children, setChildren] = useState<any[]>([])

  useEffect(() => {
    setChildren([...state.children])
  }, [])

  return (
    <MergeContext Context={BreadcrumbsContext as any} value={{ dispatch, children }}>
      <Row alignItems="center" {...props} />
    </MergeContext>
  )
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type BreadcrumbsProps = Omit<TextProps, 'children'> & {
  separator?: ReactNode
  children?: ReactNode | ((crumb?: ReturnType<typeof useBreadcrumb>) => ReactNode)
}

export function Breadcrumb({
  separator = <Text>{' >'}</Text>,
  children,
  ...props
}: BreadcrumbsProps) {
  const crumb = useBreadcrumb()

  if (typeof children === 'function') {
    return children(crumb)
  }

  // wait for all items to be mounted to render them
  if (crumb && crumb.total === 0) {
    return null
  }

  return (
    <BreadcrumbReset>
      <Text {...props}>{children}</Text>
      {crumb && crumb.isLast ? '' : separator}
    </BreadcrumbReset>
  )
}

// recommended to use below each breadcrumb to avoid accidental nesting
export function BreadcrumbReset(props: { children: any }) {
  return <BreadcrumbsContext.Provider value={null}>{props.children}</BreadcrumbsContext.Provider>
}

export type BreadcrumbItem = {
  index: number
  total: number
  isFirst: boolean
  isLast: boolean
}

export function useBreadcrumb(): BreadcrumbItem | null {
  const idRef = useRef(Math.random())
  const id = idRef.current
  const context = useContext(BreadcrumbsContext)

  useEffect(() => {
    if (!context) return
    if (context.children.indexOf(id) === -1) {
      context.dispatch({ type: 'mount', value: id })
    }
    return () => {
      if (context.children.indexOf(id) !== -1) {
        context.dispatch({ type: 'unmount', value: id })
      }
    }
  }, [])

  if (!context) {
    return null
  }

  const total = context.children.length
  const index = context.children.indexOf(id)
  const isLast = index === total - 1
  const isFirst = index === 0

  return { index, total, isLast, isFirst }
}
