import * as React from 'react'
import { Text, TextProps } from '@mcro/ui'
import { HighlightsContext } from '../helpers/contexts/HighlightsContext'
import { HighlightOptions } from '@mcro/ui/_/helpers/highlightText'

type Props = TextProps & {
  options?: HighlightOptions
}

export const HighlightText = ({ options, ...props }: Props) => (
  <HighlightsContext.Consumer>
    {term => (
      <Text
        highlight={{
          words: [term],
          maxSurroundChars: Infinity,
          maxChars: Infinity,
          ...options,
        }}
        {...props}
      />
    )}
  </HighlightsContext.Consumer>
)
