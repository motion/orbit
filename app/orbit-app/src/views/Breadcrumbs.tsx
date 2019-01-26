import { Row, Text, TextProps, View, ViewProps } from '@mcro/ui'
import React from 'react'

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
      <Row {...props} />
    </BreadcrumbsContext.Provider>
  )
}

export function Breadcrumb(props: TextProps) {
  const id = React.useRef(null)
  const { dispatch, children } = React.useContext(BreadcrumbsContext)
  const total = children.length
  const index = children.indexOf(id.current)
  const isLast = index === total - 1

  React.useEffect(() => {
    id.current = Math.random()
    dispatch({ type: 'mount', value: id.current })
    return () => {
      dispatch({ type: 'unmount', value: id.current })
    }
  }, [])

  return (
    <View>
      <Text {...props}>
        {props.children} {isLast ? '' : '>'}
      </Text>
    </View>
  )
}
