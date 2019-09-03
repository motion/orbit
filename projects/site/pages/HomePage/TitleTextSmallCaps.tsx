import React from 'react'

import { TitleTextSub } from './TitleTextSub'

export const TitleTextSmallCaps = props => (
  <TitleTextSub letterSpacing={2} textTransform="uppercase" size={0.2} {...props} />
)
