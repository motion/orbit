import { ProvideHighlight, ProvideHighlightProps, selectDefined } from '@o/ui'
import React, { memo } from 'react'

import { useActiveQuery } from '../hooks/useActiveQuery'

export const HighlightActiveQuery = memo(({ words, children, ...rest }: ProvideHighlightProps) => {
  return (
    <ProvideHighlight
      words={selectDefined(words, useActiveQuery().split(' '))}
      maxChars={500}
      maxSurroundChars={80}
      {...rest}
    >
      {children}
    </ProvideHighlight>
  )
})
