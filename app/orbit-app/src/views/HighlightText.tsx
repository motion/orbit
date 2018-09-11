import * as React from 'react'
import { Text, TextProps } from '@mcro/ui'
import { HighlightsContext } from '../helpers/contexts/HighlightsContext'
import { HighlightOptions } from '@mcro/ui/_/helpers/highlightText'

type Props = TextProps & {
  options?: HighlightOptions
}

export const HighlightText = ({ options, children, ...props }: Props) => (
  <HighlightsContext.Consumer>
    {terms => (
      <Text
        tagName="div"
        className="paragraph"
        display="block"
        color="inherit"
        selectable
        highlight={
          terms.length
            ? {
                words: terms,
                maxSurroundChars: Infinity,
                maxChars: Infinity,
                ...options,
              }
            : null
        }
        {...props}
      >
        {/* react-markdown passes us an array of length 1... */}
        {Array.isArray(children) && children.length === 1
          ? children[0]
          : children}
      </Text>
    )}
  </HighlightsContext.Consumer>
)
