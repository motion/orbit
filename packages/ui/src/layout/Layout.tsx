import { Col, gloss, Row, View } from '@o/gloss'
import React, { Children, cloneElement, createContext, isValidElement } from 'react'
import { useParentNodeSize } from '../hooks/useParentNodeSize'
import { useVisiblity } from '../Visibility'
import { MasonryLayout } from './MasonryLayout'
import { Pane } from './Pane'

export type LayoutProps = {
  type?: 'column' | 'row' | 'grid'
  children?: React.ReactNode
}

export const LayoutContext = createContext<LayoutProps & { total: number; flexes: number[] }>({
  total: 0,
  flexes: [],
})

function getLayout(props: LayoutProps) {
  switch (props.type) {
    case 'grid':
      // TODO make this legit
      return <MasonryLayout {...props} />
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
  return (
    <View flex={1} overflow="hidden" maxHeight={window.innerHeight} maxWidth={window.innerWidth}>
      <LayoutContext.Provider value={{ ...props, total, flexes }}>
        {getLayout(props)}
      </LayoutContext.Provider>
    </View>
  )
}

function FlexLayout(props: LayoutProps) {
  const visibility = useVisiblity()
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
      <LayoutRow
        minHeight={size.height || 'auto'}
        maxHeight={window.innerHeight}
        overflow="hidden"
        ref={ref}
      >
        {childElements}
      </LayoutRow>
    )
  }

  return (
    <LayoutCol
      minHeight={size.height || 'auto'}
      maxHeight={window.innerHeight}
      overflow="hidden"
      ref={ref}
    >
      {childElements}
    </LayoutCol>
  )
}

const LayoutRow = gloss(Row)
const LayoutCol = gloss(Col)
