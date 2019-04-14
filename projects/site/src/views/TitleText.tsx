import { gloss } from '@o/gloss'
import { Title } from '@o/ui'
import React from 'react'

export const TitleText = gloss(
  props => (
    <Title
      {...{
        size: 'lg',
        fontWeight: 800,
        selectable: true,
        textAlign: 'center',
      }}
      {...props}
    />
  ),
  {
    fontFamily: 'gt eesti pro display trial',
  },
)
