import { Col, gloss, Row } from '@o/gloss'
import React, { Children, cloneElement, createContext, isValidElement, useMemo } from 'react'
import { useParentNodeSize } from '../hooks/useParentNodeSize'
import { View } from '../View/View'
import { useVisibility } from '../Visibility'
import { Pane } from './Pane'

export type LayoutProps = {
  type?: 'column' | 'row'
  children?: React.ReactNode
}

export const LayoutContext = createContext<{
  total: number
  flexes: number[]
  type: LayoutProps['type']
}>({
  total: 0,
  flexes: [],
  type: 'row',
})

function getLayout(props: LayoutProps) {
  switch (props.type) {
    case 'row':
    case 'column':
    default:
      return <FlexLayout {...props} />
  }
}

export function Layout(props: LayoutProps) {
  Children.map(props.children, child => {
    if (!isValidElement(child) || child.type !== Pane) {
      throw new Error(`Invalid child: <Layout /> accepts only <Pane /> as children.`)
    }
  })
  const total = Children.count(props.children)
  const flexes = Children.map(props.children, child => (child as any).props.flex || 1)
  const memoValue = useMemo(() => ({ type: props.type, total, flexes }), [
    props.type,
    total,
    JSON.stringify(flexes),
  ])

  return (
    <View flex={1} overflow="hidden" maxHeight="100%" maxWidth="100%">
      <LayoutContext.Provider value={memoValue}>{getLayout(props)}</LayoutContext.Provider>
    </View>
  )
}

function FlexLayout(props: LayoutProps) {
  const visibility = useVisibility()
  const { ref, ...size } = useParentNodeSize({
    disable: !visibility,
    throttle: 200,
  })
  const total = Children.count(props.children)
  const dimension = props.type === 'row' ? 'width' : 'height'
  const parentSize = size[dimension]
  const childElements = Children.map(props.children, (child, index) => {
    return cloneElement(child as any, {
      index,
      total,
      parentSize,
    })
  })

  // only flex once we measure
  // const flex = parentSize ? 1 : 'inherit'

  if (props.type === 'row') {
    return (
      <LayoutRow minHeight={size.height || 'auto'} maxHeight="100vh" overflow="hidden" ref={ref}>
        {childElements}
      </LayoutRow>
    )
  }

  return (
    <LayoutCol minHeight={size.height || 'auto'} maxHeight="100vh" overflow="hidden" ref={ref}>
      {childElements}
    </LayoutCol>
  )
}

const LayoutRow = gloss(Row, {
  flex: 1,
})

const LayoutCol = gloss(Col, {
  flex: 1,
})
