import { MergeHighlightsContext, MergeHighlightsContextProps } from '@mcro/ui'
import React from 'react'
import { useActiveQuery } from '../hooks/useActiveQuery'

export function HighlightActiveQuery(props: Partial<MergeHighlightsContextProps>) {
  const activeQuery = useActiveQuery()
  return (
    <MergeHighlightsContext
      value={{
        words: activeQuery.split(' '),
        maxChars: 500,
        maxSurroundChars: 80,
        ...props.value,
      }}
    >
      {props.children}
    </MergeHighlightsContext>
  )
}
