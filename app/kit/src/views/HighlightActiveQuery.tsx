import { MergeHighlightsContext, MergeHighlightsContextProps } from '@mcro/ui'
import React, { memo } from 'react'
import { useActiveQuery } from '../hooks/useActiveQuery'

export const HighlightActiveQuery = memo(
  ({ query, value, children }: Partial<MergeHighlightsContextProps> & { query?: string }) => {
    const activeQuery = useActiveQuery()
    return (
      <MergeHighlightsContext
        value={{
          words: [query] || activeQuery.split(' '),
          maxChars: 500,
          maxSurroundChars: 80,
          ...value,
        }}
      >
        {children}
      </MergeHighlightsContext>
    )
  },
)
