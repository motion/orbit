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
  value: Partial<typeof defaultValue>
  children: any
}) => (
  <HighlightsContext.Provider
    value={{
      words: [],
      maxSurroundChars: Infinity,
      maxChars: Infinity,
      ...value,
    }}
  >
    {children}
  </HighlightsContext.Provider>
)
