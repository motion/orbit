import { Theme } from 'gloss'
import React from 'react'

import { SizedSurface, SizedSurfaceProps } from './SizedSurface'

export type SelectableViewProps = SizedSurfaceProps & {
  selected?: boolean
}

export function SelectableSurface({ selected, ...props }: SelectableViewProps) {
  return (
    <Theme alt={selected ? 'selected' : undefined}>
      <SizedSurface {...props} />
    </Theme>
  )
}
