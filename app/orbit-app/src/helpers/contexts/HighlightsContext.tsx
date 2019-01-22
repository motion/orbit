import * as React from 'react'
import { MergeContext } from '../../views/MergeContext'

const defaultValue = {
  words: [] as string[],
  maxSurroundChars: Infinity,
  maxChars: Infinity,
}

export const HighlightsContext = React.createContext(defaultValue)

export const ProvideHighlightsContextWithDefaults = ({
  value,
  children,
}: {
  value: Partial<typeof defaultValue>
  children: any
}) => (
  <MergeContext
    Context={HighlightsContext}
    value={{
      words: [],
      maxSurroundChars: Infinity,
      maxChars: Infinity,
      ...value,
    }}
  >
    {children}
  </MergeContext>
)
