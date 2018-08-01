import * as React from 'react'
import * as UI from '@mcro/ui'
import { OrbitCard } from '../views/OrbitCard'
import { Bit } from '@mcro/models'

const cardStyleDefault = {
  width: 180,
  height: 90,
  marginRight: 12,
}

export const Carousel = ({ items, cardProps = {}, ...props }) => {
  return (
    <UI.Theme name="grey">
      <UI.Row overflow="hidden" overflowX="scroll" padding={3} {...props}>
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
              ...cardStyleDefault,
              ...cardProps['style'],
            }}
          />
        ))}
      </UI.Row>
    </UI.Theme>
  )
}
