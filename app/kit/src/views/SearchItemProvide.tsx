import { Bit } from '@mcro/models'
import { MergeContext } from '@mcro/ui'
import React, { createContext, memo } from 'react'

export const SearchItemShareContext = createContext<{ item: Bit }>({ item: null })

export const SearchItemShareProvide = memo(function SearchItemShareProvide(props: {
  item: Bit
  children: any
}) {
  return (
    <MergeContext Context={SearchItemShareContext} value={{ item: props.item }}>
      {props.children}
    </MergeContext>
  )
})
