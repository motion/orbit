import * as React from 'react'
import { OrbitCard } from '../views/OrbitCard'
import { HorizontalScrollRow } from '../views/HorizontalScrollRow'

type CarouselProps = {
  items?: any[]
  verticalPadding?: number
  cardWidth?: number
  cardHeight?: number
  cardSpace?: number
  cardProps?: Object
  before?: React.ReactNode
  after?: React.ReactNode
  children?: React.ReactNode
  offset?: number
}

export const Carousel = ({
  items,
  verticalPadding = 3,
  cardWidth = 180,
  cardHeight = 90,
  cardSpace = 12,
  cardProps = {},
  offset = 0,
  before,
  after,
  ...props
}: CarouselProps) => {
  return (
    <HorizontalScrollRow height={cardHeight + verticalPadding * 2} {...props}>
      {before}
      {(items || []).map((bit, index) => (
        <OrbitCard
          key={`${index}${bit.id}`}
          pane="carousel"
          bit={bit}
          index={index + offset}
          offset={offset}
          total={items.length}
          inGrid
          {...cardProps}
          style={{
            width: cardWidth,
            height: cardHeight,
            marginRight: cardSpace,
            ...cardProps['style'],
          }}
        />
      ))}
      {after}
    </HorizontalScrollRow>
  )
}
