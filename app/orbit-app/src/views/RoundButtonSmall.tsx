import * as React from 'react'
import { RoundButton } from './RoundButton'

export const RoundButtonSmall = props => (
  <RoundButton sizeHeight={0.7} sizePadding={0.75} size={0.95} fontWeight={500} {...props} />
)
