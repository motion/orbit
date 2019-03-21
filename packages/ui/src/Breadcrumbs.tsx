import { Row, ViewProps } from '@o/gloss'
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
import { useDebounceValue } from './hooks/useDebounce'
import { Text } from './text/Text'

type BreadcrumbActions =
  | { type: 'mount'; value: any }
  | { type: 'unmount'; value: any }
  | { type: 'commit' }

const Context = createContext<{
  children: number[]
  dispatch: Dispatch<BreadcrumbActions>
} | null>(null)

function reduce(state: { children: Set<any> }, action: BreadcrumbActions) {
  switch (action.type) {
    case 'mount':
      state.children.add(action.value)
      return state
    case 'unmount':
      state.children.delete(action.value)
      return state
    case 'commit':
      return { ...state }
  }
}

export function Breadcrumbs(props: ViewProps) {
  const [state, dispatch] = useReducer(reduce, { children: new Set() })
  const debouncedState = useDebounceValue(state, 16)

  useEffect(
    () => {
      dispatch({ type: 'commit' })
    },
    [debouncedState],
  )

  return (
    <MergeContext Context={Context} value={{ dispatch, children: [...state.children] }}>
      <Row alignItems="center" {...props} />
    </MergeContext>
  )
}

export type BreadcrumbsProps = {
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
  return <Context.Provider value={null}>{props.children}</Context.Provider>
}

export type BreadcrumbInfo = {
  index: number
  total: number
  isFirst: boolean
  isLast: boolean
}

export function useBreadcrumb(): BreadcrumbInfo | null {
  const idRef = useRef(Math.random())
  const id = idRef.current
  const context = useContext(Context)

  useEffect(() => {
    if (!context) return
    context.dispatch({ type: 'mount', value: id })
    return () => {
      context.dispatch({ type: 'unmount', value: id })
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
