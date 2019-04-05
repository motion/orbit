import React from 'react'
import { SpacedView, SpacedViewProps } from './SpacedView'

export type SpacedRowProps = SpacedViewProps

export function SpacedRow(props: SpacedViewProps) {
  return <SpacedView {...props} />
}
