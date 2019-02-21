import React from 'react'
import { renderHighlightedTextSingle } from '../../helpers/renderHighlightedText'
import { ItemPropsProvider, ItemPropsProviderProps } from './ItemPropsProvider'

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
