import React, { useMemo } from 'react'
import { ItemPropsProvider, ItemPropsProviderProps } from './ItemPropsProvider'
import { renderHighlightedTextSingle } from './renderHighlightedText'

export function ItemPropsProviderSmall({
  value,
  ...props
}: Partial<ItemPropsProviderProps> & { children: any }) {
  const memoValue = useMemo(
    () => ({ oneLine: true, renderText: renderHighlightedTextSingle, ...value }),
    [JSON.stringify(value)],
  )
  return <ItemPropsProvider value={memoValue} {...props} />
}
