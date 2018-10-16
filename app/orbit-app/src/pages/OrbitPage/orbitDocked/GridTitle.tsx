import * as React from 'react'
import { SubTitle } from '../../../views'
import { view } from '@mcro/black'

const Separator = view({
  padding: [2, 16],
  margin: [0, -16, 7],
})

export const GridTitle = props => (
  <Separator>
    <SubTitle
      fontSize={13}
      lineHeight={15}
      fontWeight={500}
      padding={0}
      {...props}
    />
  </Separator>
)
