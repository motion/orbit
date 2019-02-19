import React from 'react'
import { ItemPropsProvider, ItemPropsProviderProps } from '../contexts/ItemPropsProvider'
import { renderHighlightedTextSingle } from '../views/renderHighlightedText'

export function SmallListItemPropsProvider({
  value,
  ...props
}: Partial<ItemPropsProviderProps> & { children: any }) {
  return (
    <ItemPropsProvider
      value={{ oneLine: true, renderText: renderHighlightedTextSingle, ...value }}
      {...props}
    />
  )
}
