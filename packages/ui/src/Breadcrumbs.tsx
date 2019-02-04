import { Row, ViewProps } from '@mcro/gloss'
import React from 'react'
import { Omit } from '../../../app/orbit-app/src/helpers/typeHelpers/omit'
import { Text, TextProps } from './Text'

type BreadcrumbActions = { type: 'mount'; value: any } | { type: 'unmount'; value: any }

const BreadcrumbsContext = React.createContext({
  children: [],
  dispatch: null as React.Dispatch<BreadcrumbActions>,
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
  const [state, dispatch] = React.useReducer(breadcrumbsReducer, { children: new Set() })
  return (
    <BreadcrumbsContext.Provider value={{ dispatch, children: [...state.children] }}>
      <Row alignItems="center" {...props} />
    </BreadcrumbsContext.Provider>
  )
}

export type BreadcrumbsProps = Omit<TextProps, 'children'> & {
  separator?: React.ReactNode
  children?: React.ReactNode | ((crumb?: ReturnType<typeof useBreadcrumb>) => React.ReactNode)
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
  const id = React.useRef(null)
  if (!id.current) {
    id.current = Math.random()
  }
  const breadcrumbsContext = React.useContext(BreadcrumbsContext)
  const total = breadcrumbsContext.children.length
  const index = breadcrumbsContext.children.indexOf(id.current)
  const isLast = index === total - 1

  React.useEffect(() => {
    breadcrumbsContext.dispatch({ type: 'mount', value: id.current })
    return () => {
      breadcrumbsContext.dispatch({ type: 'unmount', value: id.current })
    }
  }, [])

  return { index, total, isLast }
}
