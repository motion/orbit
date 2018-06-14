import fuzzySort from 'fuzzysort'
import * as Constants from '~/constants'

export const settingToResult = setting => ({
  id: setting.type,
  type: 'setting',
  integration: setting.type,
  icon: setting.type,
  title: (
    Constants.allIntegrations.find(x => x.integration === setting.type) || {}
  ).title,
})

export const getSlackDate = ts => {
  const split = ts.split('.')
  if (!split.length) {
    return null
  }
  return new Date(split[0] * 1000)
}

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

export * from './hoverSettler'
export * from './logClass'

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

export const getHeader = (message, key) =>
  (
    ((message.payload && message.payload.headers) || []).find(
      x => x.name === key,
    ) || {
      value: '',
    }
  ).value

export const getHeaderFromShort = bit => {
  if (!bit.data.messages || !bit.data.messages.length) {
    return null
  }
  const fromHeader = getHeader(bit.data.messages[0], 'From')
  if (!fromHeader) {
    return null
  }
  return fromHeader.replace(/ <.*/g, '')
}
