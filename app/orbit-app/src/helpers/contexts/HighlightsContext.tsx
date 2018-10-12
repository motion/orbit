import * as React from 'react'

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
  value: typeof defaultValue
  children: any
}) => (
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
