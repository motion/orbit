import { gloss } from '@o/gloss'
import React from 'react'
import { View, ViewProps } from '../View/View'
import { Padded } from './Padded'

export type ScrollableProps = ViewProps & {
  scrollable?: boolean | 'x' | 'y'
  padded?: boolean
}

export function Scrollable({ children, padded, padding, ...props }: ScrollableProps) {
  return (
    <ScrollableChrome {...props}>
      <Padded padded={padded} padding={padding}>
        {children}
      </Padded>
    </ScrollableChrome>
  )
}

export const ScrollableChrome = gloss<ScrollableProps>(View, {
  flexDirection: 'inherit',
  width: '100%',
  height: '100%',
})
