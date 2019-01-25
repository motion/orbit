import * as React from 'react'
import { MergeContext } from '../../views/MergeContext'

const defaultValue = {
  words: [] as string[],
  maxSurroundChars: Infinity,
  maxChars: Infinity,
}

export type HighlightsContextValue = typeof defaultValue
export type MergeHighlightsContextProps = {
  value: Partial<HighlightsContextValue>
  children: any
}

export const HighlightsContext = React.createContext(defaultValue)

export const MergeHighlightsContext = ({ value, children }: MergeHighlightsContextProps) => (
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
