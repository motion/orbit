import * as React from 'react'
import { view, compose } from '@mcro/black'
import { Carousel } from '../../../components/Carousel'
import { PeekRelatedStore } from '../stores/PeekRelatedStore'
import * as UI from '@mcro/ui'

const decorator = compose(
  view.attach({ relatedStore: PeekRelatedStore }),
  view,
)

export const PeekRelated = decorator(({ relatedStore, ...props }) => (
  <UI.Theme name="grey">
    <Carousel
      items={relatedStore.relatedBits}
      cardProps={{
        hide: {
          subtitle: true,
        },
        style: {
          width: 180,
          height: 78,
        },
      }}
      {...props}
    />
  </UI.Theme>
))
