import * as React from 'react'
import { Text, TextProps } from '@mcro/ui'
import { HighlightsContext } from '../helpers/contexts/HighlightsContext'
import { HighlightOptions } from '@mcro/ui/_/helpers/highlightText'

type Props = TextProps & {
  options?: HighlightOptions
}

export const HighlightText = ({ options, children, ...props }: Props) => {
  return (
    <HighlightsContext.Consumer>
      {terms => {
        return (
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
            {children}
          </Text>
        )
      }}
    </HighlightsContext.Consumer>
  )
}
