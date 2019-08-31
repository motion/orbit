import { Children, useEffect, useState } from 'react'
import React from 'react'

import { Card, CardProps } from './Card'

export type CardStackProps = CardProps & {
  /** Whether to display a single item as plain instead of as a card */
  showSinglePlain?: boolean
  /** Maximum cards to show in stack */
  max?: number
}

export const CardStack = ({ children, showSinglePlain, max = 10, ...rest }: CardStackProps) => {
  // no more than max
  const all = Children.toArray(children).slice(0, max)
  const [focused, setFocused] = useState(all.length - 1)

  useEffect(() => {
    setFocused(all.length - 1)
  }, [all.length])

  if (showSinglePlain && all.length <= 1) {
    return <>{all}</>
  }

  return (
    <>
      {all.map((item, index) => (
        <Card
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          elevation={4}
          {...cardPositionalProps(index, all.length)}
          {...rest}
          key={item['props'].id || index}
          onClick={() => setFocused(index)}
        >
          {focused === index && item}
        </Card>
      ))}
    </>
  )
}

const cardPositionalProps = (index: number, total: number) => {
  if (total === 1) {
    return {}
  }
  const mid = Math.round(total / 2)
  const distanceFromMid = index - mid
  return {
    transform: {
      scale: 0.8,
      x: distanceFromMid * 10,
      rotate: `${distanceFromMid * 2.5}deg`,
    },
  }
}
