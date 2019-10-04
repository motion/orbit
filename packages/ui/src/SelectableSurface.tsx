import { Theme } from 'gloss'
import React from 'react'

import { Surface, SurfaceProps } from './Surface'

export type SelectableViewProps = SurfaceProps & {
  selected?: boolean
}

export function SelectableSurface({ selected, ...props }: SelectableViewProps) {
  return (
    <Theme coat={selected ? 'selected' : undefined}>
      <Surface {...props} />
    </Theme>
  )
}
