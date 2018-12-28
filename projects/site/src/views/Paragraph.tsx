import * as React from 'react'
import { gloss } from '@mcro/gloss'
import { Text } from '@mcro/ui'
import { ViewPortText } from './ViewPortText'

export const Paragraph = gloss(Text, {
  fontFamily: 'Eesti Pro',
})

Paragraph.defaultProps = {
  tagName: 'p',
}

export const ViewportParagraph = props => (
  <ViewPortText>
    <Paragraph {...props} />
  </ViewPortText>
)
