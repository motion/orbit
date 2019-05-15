import { Title } from '@o/ui'
import { gloss } from 'gloss'
import React from 'react'

const titleProps = {
  size: 'lg',
  fontWeight: 800,
  selectable: true,
}

export const TitleText = gloss(
  props => (
    <Title className="font-smooth" selectable sizeLineHeight={1.1} {...titleProps} {...props} />
  ),
  {
    fontFamily: 'GT Eesti',
  },
)
