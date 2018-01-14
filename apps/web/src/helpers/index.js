// @flow
import latinize from 'latinize'
import * as React from 'react'
import fuzzy_ from './fuzzy'

export electron, { OS } from '~/helpers/electron'
export hoverSettler from './hoverSettler'
export logClass from './logClass'
export IndexDB from './indexDB'

export const trimSingleLine = str => str.trim().replace(/\s{2,}/g, ' ')

export const contextToResult = context => {
  const pretitle = context.selection || context.title
  return {
    id: context.id,
    title: trimSingleLine(
      pretitle ? `${pretitle} | ${context.appName}` : context.appName,
    ),
    subtitle: `in ${context.appName.replace('Google ', '')} · ${context.url}`,
    type: 'context',
    image: context.favicon,
    peek: false,
  }
}

// because honestly, its easy to forget when writing jsx
// maybe im missing something in flow
window.React = React

export const fuzzy = fuzzy_
export const Component = React.Component

class Cache {
  all: Set = new Set()
  add = (item: any) => this.all.add(item)
  remove = (item: any) => this.all.delete(item)
}
export const viewCache = new Cache()

import { HotKeys as OGHotKeys } from 'react-hotkeys'

// ensures it doesnt interrupt flexing
type Props = {
  style: any,
}

export const HotKeys = ({ style, ...props }: Props) => (
  <OGHotKeys
    style={{
      flex: 'inherit',
      flexFlow: 'inherit',
      flexGrow: 'inherit',
      ...style,
    }}
    {...props}
  />
)

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

export const debounceIdle = (fn, timeout) => {
  let clearId = null
  return (...args) => {
    if (clearId) cancelIdleCallback(clearId)

    clearId = requestIdleCallback(() => fn(...args), { timeout })
  }
}
