import { Row, Text, TextProps, ViewProps } from '@mcro/ui'
import React from 'react'
import { Omit } from '../helpers/typeHelpers/omit'

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
  children?: React.ReactNode | ((isLast?: boolean) => React.ReactNode)
}

export function Breadcrumb({
  separator = <Text>{' >'}</Text>,
  children,
  ...props
}: BreadcrumbsProps) {
  const id = React.useRef(null)
  const breadcrumbsContext = React.useContext(BreadcrumbsContext)
  const total = breadcrumbsContext.children.length
  const index = breadcrumbsContext.children.indexOf(id.current)
  const isLast = index === total - 1

  React.useEffect(() => {
    id.current = Math.random()
    breadcrumbsContext.dispatch({ type: 'mount', value: id.current })
    return () => {
      breadcrumbsContext.dispatch({ type: 'unmount', value: id.current })
    }
  }, [])

  if (typeof children === 'function') {
    return children(isLast)
  }

  return (
    <>
      <Text {...props}>{children}</Text>
      {isLast ? '' : separator}
    </>
  )
}
