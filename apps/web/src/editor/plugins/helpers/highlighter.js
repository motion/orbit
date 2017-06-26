/* @flow */
import { findAll } from './highlightCore'
import React from 'react'

/**
 * Highlights all occurrences of search terms (searchText) within a string (textToHighlight).
 * This function returns an array of strings and <span>s (wrapping highlighted words).
 */
export default function Highlighter({
  activeClassName = '',
  activeIndex = -1,
  autoEscape,
  className,
  highlightClassName = '',
  highlightStyle = {},
  highlightTag = 'mark',
  searchWords,
  textToHighlight,
  sanitize,
}) {
  const chunks = findAll({
    autoEscape,
    sanitize,
    searchWords,
    textToHighlight,
  })
  const HighlightTag = highlightTag
  let highlightCount = -1
  let highlightClassNames = ''

  return (
    <span $$text className={className}>
      {chunks.map((chunk, index) => {
        const text = textToHighlight.substr(
          chunk.start,
          chunk.end - chunk.start
        )

        if (chunk.highlight) {
          highlightCount++
          highlightClassNames = `${highlightClassName} ${highlightCount === +activeIndex ? activeClassName : ''}`

          return (
            <HighlightTag
              className={highlightClassNames}
              key={index}
              style={highlightStyle}
            >
              {text}
            </HighlightTag>
          )
        } else {
          return <span key={index}>{text}</span>
        }
      })}
    </span>
  )
}
