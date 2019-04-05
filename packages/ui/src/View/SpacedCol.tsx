import React from 'react'
import { SpacedView, SpacedViewProps } from './SpacedView'

export type SpacedColProps = SpacedViewProps

export function SpacedCol(props: SpacedViewProps) {
  return <SpacedView flexDirection="column" {...props} />
}
