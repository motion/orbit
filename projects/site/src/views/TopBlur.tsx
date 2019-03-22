import { FullScreen } from '@o/ui'
import React from 'react'
import topblur from '../../public/ux/topblur.svg'

export const TopBlur = () => (
  <FullScreen zIndex={0}>
    <img src={topblur} />
  </FullScreen>
)
