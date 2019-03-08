import { Row } from '@o/gloss'
import React, { Children, cloneElement, useEffect, useRef, useState } from 'react'
import { useResizeObserver } from '../hooks/useResizeObserver'

export function VerticalSplit(props: { children: any }) {
  const [width, setWidth] = useState(0)
  const node = useRef<HTMLDivElement>(null)
  const parentNode = node.current && node.current.parentElement

  useEffect(
    () => {
      if (node.current) {
        setWidth(node.current.parentElement.clientWidth)
      }
    },
    [node.current],
  )

  useResizeObserver(parentNode, entries => {
    const next = entries[0].contentRect.width
    if (next !== width) {
      setWidth(next)
    }
  })

  return (
    <Row flex={1} ref={node}>
      {Children.map(props.children, (child, index) => {
        return cloneElement(child, {
          index,
          parentWidth: width,
        })
      })}
    </Row>
  )
}
