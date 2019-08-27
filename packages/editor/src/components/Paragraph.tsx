import React from 'react'

import { SlateNodeProps } from '../types'

export function Paragraph({ attributes, children }: SlateNodeProps) {
  return <p {...attributes}>{children}</p>
}
