import React from 'react'

import { SlateNodeProps } from '../types'
import { TodoItem } from './TodoItem'

export function ListItem({ children, node, attributes, ...props }: SlateNodeProps) {
  const checked = node.data.get('checked')

  if (checked !== undefined) {
    return (
      <TodoItem node={node} attributes={attributes} {...props}>
        {children}
      </TodoItem>
    )
  }
  return <li {...attributes}>{children}</li>
}
