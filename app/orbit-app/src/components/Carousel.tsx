import * as React from 'react'
import * as UI from '@mcro/ui'
import { OrbitCard } from '../views/OrbitCard'
import { Bit } from '@mcro/models'
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
}

export const Carousel = ({
  items,
  verticalPadding = 3,
  cardWidth = 180,
  cardHeight = 90,
  cardSpace = 12,
  cardProps = {},
  before,
  after,
}: CarouselProps) => {
  return (
    <UI.Theme name="grey">
      <HorizontalScrollRow height={cardHeight + verticalPadding * 2}>
        {before}
        {(items || []).map((bit, index) => (
          <OrbitCard
            key={`${index}${bit.id}`}
            pane="carousel"
            bit={bit instanceof Bit ? bit : null}
            {...(!(bit instanceof Bit) ? bit : null)}
            index={index}
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
    </UI.Theme>
  )
}
