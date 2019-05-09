import { gloss } from 'gloss'
import { Title } from '@o/ui'
import React from 'react'

const titleProps = {
  size: 'lg',
  fontWeight: 800,
  selectable: true,
}

export const TitleText = gloss(
  props => <Title className="font-smooth" selectable {...titleProps} {...props} />,
  {
    fontFamily: 'GT Eesti',
  },
)
