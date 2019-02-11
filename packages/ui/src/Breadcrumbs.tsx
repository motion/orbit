import { Row, ViewProps } from '@mcro/gloss'
import React, {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react'
import { MergeContext } from './helpers/MergeContext'
import { Text, TextProps } from './Text'

type BreadcrumbActions = { type: 'mount'; value: any } | { type: 'unmount'; value: any }

const defaultBreadcrumbContext = {
  children: [],
  dispatch: null as Dispatch<BreadcrumbActions>,
}

const BreadcrumbsContext = createContext(defaultBreadcrumbContext)

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
  return (
    <MergeContext Context={BreadcrumbsContext} value={{ dispatch, children: [...state.children] }}>
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

  return (
    <>
      <Text {...props}>{children}</Text>
      {crumb.isLast ? '' : separator}
    </>
  )
}

export function ResetBreadcrumb(props: { children: any }) {
  return (
    <MergeContext Context={BreadcrumbsContext} value={defaultBreadcrumbContext}>
      {props.children}
    </MergeContext>
  )
}

export type BreadcrumbItem = {
  index: number
  total: number
  isFirst: boolean
  isLast: boolean
}

export function useBreadcrumb(): BreadcrumbItem {
  const idRef = useRef(Math.random())
  const id = idRef.current
  const context = useContext(BreadcrumbsContext)
  const dispatch = context && context.dispatch

  useEffect(() => {
    if (!dispatch) return
    if (context.children.indexOf(id) === -1) {
      dispatch({ type: 'mount', value: id })
    }
    return () => {
      if (context.children.indexOf(id) !== -1) {
        dispatch({ type: 'unmount', value: id })
      }
    }
  }, [])

  if (!dispatch) {
    return null
  }

  const total = context.children.length
  const index = context.children.indexOf(id)
  const isLast = index === total - 1
  const isFirst = index === 0

  return { index, total, isLast, isFirst }
}
