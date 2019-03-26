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

export type LayoutProps = {
  style?: 'column' | 'row' | 'grid'
  children?: React.ReactNode
}

export const LayoutContext = createContext({} as LayoutProps)

function getLayout(props: LayoutProps) {
  switch (props.style) {
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
  return <LayoutContext.Provider value={props}>{getLayout(props)}</LayoutContext.Provider>
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
    // TODO validate better through .type
    if (!isValidElement(child)) {
      throw new Error(`Invalid child passed, must be of type <Pane />`)
    }
    return cloneElement(child as any, {
      index,
      total,
      parentSize: size,
    })
  })

  if (props.style === 'row') {
    return (
      <Row flex={1} overflowY="hidden" overflowX="auto" ref={node}>
        {childElements}
      </Row>
    )
  }

  return (
    <Col flex={1} overflowY="auto" overflowX="hidden" ref={node}>
      {childElements}
    </Col>
  )
}
