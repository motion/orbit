import { ProvideHighlight, ProvideHighlightProps, selectDefined } from '@o/ui'
import React, { memo } from 'react'

import { useActiveQuery } from '../hooks/useActiveQuery'

export const HighlightActiveQuery = memo(({ query, children, ...rest }: ProvideHighlightProps) => {
  const activeQuery = selectDefined(query, useActiveQuery())
  return (
    <ProvideHighlight words={activeQuery.split(' ')} maxChars={500} maxSurroundChars={80} {...rest}>
      {children}
    </ProvideHighlight>
  )
})
