import * as React from 'react'
import { view, compose, attach } from '@mcro/black'
import { Section } from './Section'
import { Masonry } from '../views/Masonry'
import { OrbitCard } from '../views/OrbitCard'

const decorator = compose(
  attach('subPaneStore'),
  view,
)

export const OrbitGridSection = decorator(
  ({ subPaneStore, startIndex, items, categoryName, cardProps, ...props }) => {
    return (
      <Section type="carousel" title={categoryName} {...props}>
        <Masonry>
          {items.map((item, index) => {
            return <OrbitCard model={item} index={index + startIndex} {...cardProps} />
          })}
        </Masonry>
      </Section>
    )
  },
)
