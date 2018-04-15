import fuzzySort from 'fuzzysort'

export const fuzzy = (query, results, extraOpts) =>
  !query
    ? results
    : fuzzySort
        .go(query, results, {
          key: 'title',
          // threshold: -25,
          limit: 8,
          ...extraOpts,
        })
        .map(x => x.obj)

import latinize from 'latinize'
import * as React from 'react'

export hoverSettler from './hoverSettler'
export logClass from './logClass'

export const trimSingleLine = str => str.trim().replace(/\s{2,}/g, ' ')
export const sleep = ms => new Promise(res => setTimeout(res, ms))
export const Component = React.Component

// alphanumeric and spacse
export const cleanText = s => {
  if (s.toLowerCase) {
    return latinize(s || '')
      .toLowerCase()
      .replace(/[^0-9a-zA-Z\ ]/g, '')
  } else {
    return ''
  }
}
