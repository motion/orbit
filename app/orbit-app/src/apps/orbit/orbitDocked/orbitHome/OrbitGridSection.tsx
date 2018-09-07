import * as React from 'react'
import { view, compose } from '@mcro/black'
import { OrbitSection } from './OrbitSection'
import { Masonry } from '../../../../views/Masonry'
import { OrbitCard } from '../../../../views/OrbitCard'

const decorator = compose(
  view.attach('subPaneStore'),
  view,
)

export const OrbitGridSection = decorator(
  ({ subPaneStore, startIndex, items, categoryName, cardProps, ...props }) => {
    return (
      <OrbitSection title={categoryName} {...props}>
        <Masonry>
          {items.map((item, index) => {
            return (
              <OrbitCard
                model={item}
                index={index + startIndex}
                {...cardProps}
              />
            )
          })}
        </Masonry>
      </OrbitSection>
    )
  },
)
