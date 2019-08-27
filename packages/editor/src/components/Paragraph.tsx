import React from 'react'

import { SlateNodeProps } from '../types'

export function Paragraph({ attributes, children }: SlateNodeProps) {
  return <div {...attributes}>{children}</div>
}
