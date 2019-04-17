import { FullScreen, ViewProps } from '@o/ui'
import React from 'react'
import topblur from '../../public/images/topblur.svg'

export const TopBlur = (props: ViewProps) => (
  <FullScreen
    backgroundImage={`url(${topblur})`}
    backgroundPosition="top center"
    zIndex={0}
    {...props}
  />
)
