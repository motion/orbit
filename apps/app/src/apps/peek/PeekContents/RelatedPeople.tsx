import * as React from 'react'
import { view } from '@mcro/black'
import { PeekSection } from './PeekViews'
import { SubTitle } from '../../../views'
import * as UI from '@mcro/ui'
import { Carousel } from '../../../components/Carousel'

export const RelatedPeople = view(
  ({ title = 'Related People', relatedStore }) => (
    <PeekSection>
      <SubTitle>{title}</SubTitle>
      <UI.Theme name="grey">
        <Carousel
          items={relatedStore.relatedPeople}
          cardStyle={{
            width: 160,
            height: 120,
          }}
        />
      </UI.Theme>
    </PeekSection>
  ),
)
