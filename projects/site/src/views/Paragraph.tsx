import { gloss } from '@o/gloss'
import { Text } from '@o/ui'
import * as React from 'react'
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
