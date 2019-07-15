import { createStoreContext } from '@o/use-store'
import React, { useMemo } from 'react'

import { useDebounceValue } from './hooks/useDebounce'
import { Text, TextProps } from './text/Text'

export type HighlightQueryProps = {
  words?: string[]
  maxSurroundChars?: number
  maxChars?: number
}

const defaultState: HighlightQueryProps = {
  words: [] as string[],
  maxSurroundChars: Infinity,
  maxChars: Infinity,
}

class HighlightQueryStore {
  props: HighlightQueryProps

  get state() {
    return Object.assign(defaultState, this.props)
  }
}

const HighlightQueryStoreContext = createStoreContext(HighlightQueryStore)

export type ProvideHighlightProps = HighlightQueryProps & { children?: React.ReactNode }

export const ProvideHighlight = ({ children, ...props }: ProvideHighlightProps) => {
  const valueDebounced = useDebounceValue(JSON.stringify(props), 200)
  const value = useMemo(() => props, [valueDebounced])
  return (
    <HighlightQueryStoreContext.Provider {...value}>{children}</HighlightQueryStoreContext.Provider>
  )
}

export type HighlightTextProps = TextProps

export function HighlightText({ children, ...props }: HighlightTextProps) {
  const { state } = HighlightQueryStoreContext.useStore()
  const highlight =
    state.words &&
    (state.words.length > 1 ||
      // avoid too short of words
      (state.words[0] && state.words[0].length > 1))
      ? state
      : null
  return (
    <Text tagName="div" className="paragraph" display="block" highlight={highlight} {...props}>
      {children}
    </Text>
  )
}
