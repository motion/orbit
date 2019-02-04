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
import { Text, TextProps } from './Text'

type BreadcrumbActions = { type: 'mount'; value: any } | { type: 'unmount'; value: any }

const BreadcrumbsContext = createContext({
  children: [],
  dispatch: null as Dispatch<BreadcrumbActions>,
})

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
    <BreadcrumbsContext.Provider value={{ dispatch, children: [...state.children] }}>
      <Row alignItems="center" {...props} />
    </BreadcrumbsContext.Provider>
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

export function useBreadcrumb() {
  const id = useRef(null)
  if (!id.current) {
    id.current = Math.random()
  }
  const breadcrumbsContext = useContext(BreadcrumbsContext)
  const total = breadcrumbsContext.children.length
  const index = breadcrumbsContext.children.indexOf(id.current)
  const isLast = index === total - 1

  useEffect(() => {
    breadcrumbsContext.dispatch({ type: 'mount', value: id.current })
    return () => {
      breadcrumbsContext.dispatch({ type: 'unmount', value: id.current })
    }
  }, [])

  return { index, total, isLast }
}
