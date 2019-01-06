import * as React from 'react'
import { SubTitle } from './SubTitle'
import { gloss } from '@mcro/gloss'

const Separator = gloss({
  padding: [2, 16],
  margin: [0, -16, 7],
})

export const GridTitle = props => (
  <Separator>
    <SubTitle fontSize={13} lineHeight={15} fontWeight={500} padding={0} {...props} />
  </Separator>
)
