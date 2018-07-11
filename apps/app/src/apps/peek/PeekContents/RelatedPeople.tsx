import * as React from 'react'
import { view } from '@mcro/black'
import { PeekSection } from './PeekViews'
import { SubTitle } from '../../../views'
import * as UI from '@mcro/ui'
import { OrbitCardMasonry } from '../../../apps/orbit/OrbitCardMasonry'

export const RelatedPeople = view(({ relatedStore }) => (
  <PeekSection>
    <SubTitle>Related</SubTitle>
    <UI.Theme name="grey">
      <OrbitCardMasonry items={relatedStore.relatedPeople} />
    </UI.Theme>
  </PeekSection>
))
