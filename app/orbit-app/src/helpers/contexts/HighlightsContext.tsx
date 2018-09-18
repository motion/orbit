import * as React from 'react'

export const HighlightsContext = React.createContext({
  words: [] as string[],
  maxSurroundChars: Infinity,
  maxChars: Infinity,
})

export const ProvideHighlightsContextWithDefaults = ({ value, children }) => (
  <HighlightsContext.Provider
    value={{
      maxSurroundChars: Infinity,
      maxChars: Infinity,
      ...value,
    }}
  >
    {children}
  </HighlightsContext.Provider>
)
