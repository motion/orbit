import React from 'react'
import { ItemPropsProvider, ItemPropsProviderProps } from './ItemPropsProvider'
import { renderHighlightedTextSingle } from './renderHighlightedText'

export function ItemPropsProviderSmall({
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
