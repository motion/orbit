import { Col, Row } from '@o/gloss'
import React, { Children, cloneElement, createContext, isValidElement } from 'react'
import { useParentNodeSize } from '../hooks/useParentNodeSize'
import { GridLayout } from './GridLayout'
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
      return <GridLayout {...props} />
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
    <LayoutContext.Provider value={{ ...props, total, flexes }}>
      {getLayout(props)}
    </LayoutContext.Provider>
  )
}

function FlexLayout(props: LayoutProps) {
  const { ref, ...size } = useParentNodeSize()
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
      <Row overflow="hidden" ref={ref}>
        {childElements}
      </Row>
    )
  }

  return (
    <Col overflow="hidden" ref={ref}>
      {childElements}
    </Col>
  )
}
