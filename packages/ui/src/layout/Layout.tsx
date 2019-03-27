import { isEqual } from '@o/fast-compare'
import { Col, Row } from '@o/gloss'
import { pick } from 'lodash'
import React, {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useResizeObserver } from '../hooks/useResizeObserver'
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
  const [size, setSize] = useState({ width: 0, height: 0 })
  const node = useRef<HTMLDivElement>(null)
  const parent = useRef(null)

  useEffect(
    () => {
      parent.current = node.current && node.current.parentElement
    },
    [node],
  )

  useEffect(
    () => {
      if (node.current) {
        setSize({
          width: node.current.parentElement.clientWidth,
          height: node.current.parentElement.clientHeight,
        })
      }
    },
    [node],
  )

  useResizeObserver({
    ref: parent,
    onChange: entries => {
      const next = pick(entries[0].contentRect, 'width', 'height')
      if (!isEqual(next, size)) {
        setSize(next)
      }
    },
  })

  const total = Children.count(props.children)

  const childElements = Children.map(props.children, (child, index) => {
    const dimension = props.type === 'row' ? 'width' : 'height'
    return cloneElement(child as any, {
      index,
      total,
      parentSize: size[dimension],
    })
  })

  if (props.type === 'row') {
    return (
      <Row flex={1} overflow="hidden" ref={node}>
        {childElements}
      </Row>
    )
  }

  return (
    <Col flex={1} overflow="hidden" ref={node}>
      {childElements}
    </Col>
  )
}
