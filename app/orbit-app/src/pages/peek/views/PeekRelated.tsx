import * as React from 'react'
import { view, compose } from '@mcro/black'
import { Carousel } from '../../../components/Carousel'
import { PeekRelatedStore } from '../stores/PeekRelatedStore'

const decorator = compose(
  view.attach({ relatedStore: PeekRelatedStore }),
  view,
)

export const PeekRelated = decorator(({ relatedStore, ...props }) => (
  <Carousel
    items={relatedStore.relatedBits}
    cardWidth={180}
    cardHeight={62}
    cardSpace={5}
    verticalPadding={5}
    cardProps={{
      titleProps: {
        size: 1,
        fontWeight: 500,
      },
      padding: 10,
      hide: {
        subtitle: true,
        body: true,
      },
    }}
    {...props}
  />
))
