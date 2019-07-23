import { isDefined, ProvideHighlight, ProvideHighlightProps } from '@o/ui'
import React, { memo } from 'react'

import { useActiveQuery } from '../hooks/useActiveQuery'

export const HighlightActiveQuery = memo(({ query, children, ...rest }: ProvideHighlightProps) => {
  return (
    <ProvideHighlight
      query={isDefined(query) ? query : useActiveQuery()}
      maxChars={500}
      maxSurroundChars={80}
      {...rest}
    >
      {children}
    </ProvideHighlight>
  )
})
