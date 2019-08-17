import { createStoreContext } from '@o/use-store'
import { HighlightOptions, selectDefined } from '@o/utils'
import React, { useMemo } from 'react'

import { useDebounceValue } from './hooks/useDebounce'
import { Text, TextProps } from './text/Text'

export type HighlightQueryProps = {
  query?: string
  maxSurroundChars?: number
  maxChars?: number
}

const defaultState: HighlightQueryProps = {
  query: '',
  maxSurroundChars: Infinity,
  maxChars: Infinity,
}

class HighlightQueryStore {
  props: HighlightQueryProps

  get state() {
    const res = { ...defaultState }
    for (const key in this.props) {
      res[key] = this.props[key]
    }
    return res
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

export type HighlightTextProps = TextProps & HighlightQueryProps

export function HighlightText({
  children,
  maxSurroundChars,
  maxChars,
  ...props
}: HighlightTextProps) {
  const { state } = HighlightQueryStoreContext.useStore()
  const query = selectDefined(props.query, state.query)
  const words = query.split(' ')
  const text =
    words &&
    (words.length > 1 ||
      // avoid too short of words
      (words[0] && words[0].length > 1))
      ? words.join(' ')
      : ''
  const highlight: HighlightOptions = useMemo(
    () => ({
      maxSurroundChars: maxSurroundChars || state.maxSurroundChars,
      maxChars: maxChars || state.maxChars,
      words,
      text,
    }),
    [state.maxSurroundChars, state.maxChars, text, query, maxSurroundChars, maxChars],
  )
  return (
    <Text tagName="div" className="paragraph" display="block" highlight={highlight} {...props}>
      {children}
    </Text>
  )
}
